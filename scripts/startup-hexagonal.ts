#!/usr/bin/env tsx

/**
 * SOAR Feedback System - Enhanced Startup Script (Hexagonal Architecture)
 * 
 * Handles database initialization, migrations, and health checks
 * following hexagonal architecture principles with ports and adapters.
 */

import { config } from "dotenv";
import { DatabaseInitializationService } from "../src/services/DatabaseInitializationService";

// Load environment variables
config({ path: [".env.local", ".env"] });

interface StartupOptions {
  runMigrations: boolean;
  runSeeders: boolean;
  healthCheck: boolean;
  verbose: boolean;
}

/**
 * Parse command line arguments
 */
function parseArguments(): StartupOptions {
  const args = process.argv.slice(2);
  console.log("🔧 Command line arguments:", args);
  
  const options = {
    runMigrations: !args.includes("--no-migrations"),
    runSeeders: args.includes("--seed") || args.includes("--seeders"),
    healthCheck: !args.includes("--no-health-check"),
    verbose: args.includes("--verbose") || args.includes("-v"),
  };
  
  console.log("🔧 Parsed options:", JSON.stringify(options, null, 2));
  return options;
}

/**
 * Validate environment variables
 */
function validateEnvironment(): void {
  const requiredVars = ["DATABASE_URL"];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:", missing.join(", "));
    console.error("Please ensure your .env.local or .env file contains the required variables.");
    process.exit(1);
  }
}

/**
 * Perform database health check
 */
async function performHealthCheck(dbService: DatabaseInitializationService): Promise<void> {
  console.log("🔍 Performing database health check...");
  
  try {
    const isHealthy = await dbService.healthCheck();
    if (isHealthy) {
      console.log("✅ Database health check passed");
    } else {
      console.warn("⚠️ Database health check indicates potential issues");
    }

    // Get detailed status for verbose output
    const status = await dbService.getMigrationStatus();
    console.log(`📊 Migration status: ${status.applied.length} applied, ${status.pending.length} pending`);
    
    if (status.pending.length > 0) {
      console.warn("⚠️ Pending migrations detected:", status.pending);
    }
  } catch (error) {
    console.error("❌ Database health check failed:", error);
    throw error;
  }
}

/**
 * Main startup function
 */
async function startup(): Promise<void> {
  try {
    console.log("🚀 SOAR Feedback System - Starting up...");
    console.log("=" .repeat(50));
    
    // Parse arguments and validate environment
    const options = parseArguments();
    validateEnvironment();
    
    if (options.verbose) {
      console.log("🔧 Startup options:", JSON.stringify(options, null, 2));
      console.log("🌍 Environment: NODE_ENV =", process.env.NODE_ENV || "development");
    }
    
    // Initialize database service
    const dbService = DatabaseInitializationService.getInstance();
    
    // Perform database initialization
    await dbService.initialize({
      runMigrations: options.runMigrations,
      runSeeders: options.runSeeders,
    });
    
    // Run health check if enabled
    if (options.healthCheck) {
      await performHealthCheck(dbService);
    }
    
    console.log("=" .repeat(50));
    console.log("✅ SOAR Feedback System startup completed successfully!");
    console.log("🌐 Ready to serve requests...");
    
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
}

/**
 * Handle script execution
 */
if (require.main === module) {
  startup().catch((error) => {
    console.error("💥 Fatal startup error:", error);
    process.exit(1);
  });
}

export { startup };
