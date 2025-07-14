/**
 * Application initialization
 * This module runs once when the application starts
 */

import { initializeDatabase } from "./db-init";

// Initialize database on application startup
// This runs when the module is first imported
initializeDatabase().catch((error) => {
  console.error("Failed to initialize database on startup:", error);
  // Don't crash the app - let individual API routes handle DB initialization
});

export { initializeDatabase };
