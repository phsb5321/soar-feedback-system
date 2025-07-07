#!/usr/bin/env node

/**
 * Production startup script for deployment validation
 * This script is designed to run in production environments where
 * environment variables are provided by the deployment platform
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting production deployment validation...");
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log(
  `Database URL configured: ${process.env.DATABASE_URL ? "Yes" : "No"}`
);

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

// Run the startup script
const startupScript = path.join(__dirname, "startup.ts");
const child = spawn("tsx", [startupScript], {
  stdio: "inherit",
  env: process.env,
});

child.on("close", (code) => {
  if (code === 0) {
    console.log("✅ Production startup validation completed successfully");
    process.exit(0);
  } else {
    console.error(`❌ Production startup validation failed with code ${code}`);
    process.exit(1);
  }
});

child.on("error", (error) => {
  console.error("❌ Failed to start validation script:", error);
  process.exit(1);
});
