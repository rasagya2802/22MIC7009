const axios = require("axios");
const { solveKnapsack } = require("../utils/knapsack");

const BASE_URL = "http://4.224.186.213/evaluation-service";

const token = process.env.ACCESS_TOKEN;

const tryRequest = async (url) => {
  const headerOptions = [
    {
      name: "Authorization Bearer",
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    {
      name: "Authorization raw token",
      headers: {
        Authorization: token
      }
    },
    {
      name: "token header",
      headers: {
        token: token
      }
    },
    {
      name: "x-access-token header",
      headers: {
        "x-access-token": token
      }
    }
  ];

  for (const option of headerOptions) {
    try {
      console.log(`Trying ${url} with ${option.name}`);

      const response = await axios.get(`${BASE_URL}${url}`, {
        headers: option.headers
      });

      console.log(`Success with ${option.name}`);
      return response;
    } catch (error) {
      console.log(
        `Failed with ${option.name}:`,
        error.response?.status,
        error.response?.data || error.message
      );
    }
  }

  throw new Error(`All authorization header formats failed for ${url}`);
};

const getDepotId = (vehicle) => {
  return vehicle.DepotID || vehicle.depotId || vehicle.DepotId || vehicle.depotID;
};

const generateSchedule = async () => {
  console.log("Token exists:", !!token);
  console.log("Token preview:", token ? token.slice(0, 25) : "NO TOKEN");

  const depotResponse = await tryRequest("/depots");
  const vehicleResponse = await tryRequest("/vehicles");

  console.log("Depot response keys:", Object.keys(depotResponse.data));
  console.log("Vehicle response keys:", Object.keys(vehicleResponse.data));

  const depots = depotResponse.data.depots || depotResponse.data.Depots || [];
  const vehicles = vehicleResponse.data.vehicles || vehicleResponse.data.Vehicles || [];

  const finalSchedule = [];

  for (const depot of depots) {
    const depotId = depot.ID || depot.id;
    const mechanicHours = depot.MechanicHours || depot.mechanicHours;

    const vehiclesForDepot = vehicles.filter(vehicle => {
      return getDepotId(vehicle) === depotId;
    });

    const optimalResult = solveKnapsack(vehiclesForDepot, mechanicHours);

    finalSchedule.push({
      depotId: depotId,
      availableMechanicHours: mechanicHours,
      selectedVehicles: optimalResult.selectedVehicles,
      totalServiceHours: optimalResult.totalServiceHours,
      totalImpactScore: optimalResult.totalImpactScore
    });
  }

  return {
    schedules: finalSchedule
  };
};

module.exports = {
  generateSchedule
};