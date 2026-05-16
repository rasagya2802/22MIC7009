const getServiceHours = (vehicle) => {
  return vehicle.ServiceHours || vehicle.serviceHours || vehicle.Duration || vehicle.duration || 0;
};

const getImpactScore = (vehicle) => {
  return vehicle.ImpactScore || vehicle.impactScore || vehicle.Score || vehicle.score || 0;
};

const solveKnapsack = (vehicles, capacity) => {
  const n = vehicles.length;

  const dp = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const serviceHours = getServiceHours(vehicles[i - 1]);
    const impactScore = getImpactScore(vehicles[i - 1]);

    for (let hours = 0; hours <= capacity; hours++) {
      if (serviceHours <= hours) {
        dp[i][hours] = Math.max(
          dp[i - 1][hours],
          impactScore + dp[i - 1][hours - serviceHours]
        );
      } else {
        dp[i][hours] = dp[i - 1][hours];
      }
    }
  }

  let selectedVehicles = [];
  let hours = capacity;

  for (let i = n; i > 0; i--) {
    if (dp[i][hours] !== dp[i - 1][hours]) {
      const vehicle = vehicles[i - 1];
      selectedVehicles.push(vehicle);
      hours -= getServiceHours(vehicle);
    }
  }

  selectedVehicles.reverse();

  const totalServiceHours = selectedVehicles.reduce(
    (sum, vehicle) => sum + getServiceHours(vehicle),
    0
  );

  const totalImpactScore = selectedVehicles.reduce(
    (sum, vehicle) => sum + getImpactScore(vehicle),
    0
  );

  return {
    selectedVehicles,
    totalServiceHours,
    totalImpactScore
  };
};

module.exports = {
  solveKnapsack
};