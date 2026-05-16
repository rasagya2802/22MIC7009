require("dotenv").config();

const express = require("express");
const cors = require("cors");
const schedulerRoutes = require("./routes/schedulerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Vehicle Maintenance Scheduler Microservice is running"
  });
});

app.use("/api", schedulerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});