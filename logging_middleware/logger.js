const axios = require("axios");

const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

const allowedStacks = ["backend", "frontend"];

const allowedLevels = ["debug", "info", "warn", "error", "fatal"];

const backendOnlyPackages = [
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service"
];

const frontendOnlyPackages = [
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style"
];

const commonPackages = [
  "auth",
  "config",
  "middleware",
  "utils"
];

function isValidPackage(stack, packageName) {
  if (commonPackages.includes(packageName)) {
    return true;
  }

  if (stack === "backend") {
    return backendOnlyPackages.includes(packageName);
  }

  if (stack === "frontend") {
    return frontendOnlyPackages.includes(packageName);
  }

  return false;
}

async function Log(stack, level, packageName, message, token = "") {
  try {
    stack = String(stack).toLowerCase();
    level = String(level).toLowerCase();
    packageName = String(packageName).toLowerCase();

    if (!allowedStacks.includes(stack)) {
      throw new Error("Invalid stack. Allowed values: backend, frontend");
    }

    if (!allowedLevels.includes(level)) {
      throw new Error("Invalid level. Allowed values: debug, info, warn, error, fatal");
    }

    if (!isValidPackage(stack, packageName)) {
      throw new Error("Invalid package for selected stack");
    }

    const payload = {
      stack: stack,
      level: level,
      package: packageName,
      message: message
    };

    const headers = {
      "Content-Type": "application/json"
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios.post(LOG_API_URL, payload, { headers });

    console.log("Log created successfully:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Logging API error:", error.response.data);
    } else {
      console.error("Logging failed:", error.message);
    }

    return null;
  }
}

module.exports = Log;