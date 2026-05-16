const { generateSchedule } = require("../services/schedulerService");

const getMaintenanceSchedule = async (req, res) => {
  try {
    const result = await generateSchedule();

    res.status(200).json({
      success: true,
      message: "Optimal vehicle maintenance schedule generated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error generating schedule:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to generate maintenance schedule",
      error: error.message
    });
  }
};

module.exports = {
  getMaintenanceSchedule
};