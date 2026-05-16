const Log = require("./logger");

async function testLogger() {
  const token = process.argv[2];

  if (!token) {
    console.log("Usage:");
    console.log("node logging_middleware/test_logger.js YOUR_AUTH_TOKEN");
    return;
  }

  await Log(
    "backend",
    "error",
    "handler",
    "received string, expected bool",
    token
  );

  await Log(
    "backend",
    "fatal",
    "db",
    "critical database connection failure",
    token
  );

  await Log(
    "backend",
    "info",
    "service",
    "priority service executed",
    token
  );
}

testLogger();