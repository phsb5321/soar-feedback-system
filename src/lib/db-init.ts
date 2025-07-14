/**
 * Database initialization module
 * This module ensures the database is properly initialized when the app starts
 */

import { sql } from "drizzle-orm";
import { db, testConnection } from "../../drizzle/config";

let initPromise: Promise<void> | null = null;
let isInitialized = false;

/**
 * Initialize the database (run migrations if needed)
 * This function is idempotent - it can be called multiple times safely
 */
export async function initializeDatabase(): Promise<void> {
  // If already initialized, return immediately
  if (isInitialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  initPromise = performInitialization();
  await initPromise;
  isInitialized = true;
}

async function performInitialization(): Promise<void> {
  try {
    console.log("🔍 Checking database connection and schema...");

    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Database connection failed");
    }

    // Check if feedback table exists
    const tableExists = await checkTableExists();
    
    if (!tableExists) {
      console.log("⚠️  Feedback table doesn't exist, creating it...");
      await runMigrations();
      console.log("✅ Database initialized successfully");
    } else {
      console.log("✅ Database schema is up to date");
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    // Don't throw in production - let the app continue and handle DB errors gracefully
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
  }
}

async function checkTableExists(): Promise<boolean> {
  try {
    // Try to query the table directly - if it fails, the table doesn't exist
    await db.execute(sql`
      SELECT 1 FROM feedback LIMIT 1;
    `);
    
    console.log("✅ Feedback table exists and is accessible");
    return true;
  } catch (error: unknown) {
    // Check if the error is specifically about the table not existing
    const dbError = error as { code?: string; message?: string };
    if (dbError?.code === '42P01' || dbError?.message?.includes('does not exist')) {
      console.log("⚠️  Feedback table does not exist");
      return false;
    }
    
    // For other errors, log them but assume table exists to avoid unnecessary recreation
    console.warn("Warning checking table existence:", dbError.message || String(error));
    return true;
  }
}

async function runMigrations(): Promise<void> {
  try {
    console.log("🔄 Running database migrations...");

    // Create the feedback table with proper structure
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        audio_url TEXT NOT NULL,
        transcription TEXT NOT NULL,
        csat INTEGER,
        additional_comment TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    // Add indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_csat ON feedback(csat) WHERE csat IS NOT NULL;
    `);

    console.log("✅ Database migrations completed successfully!");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    throw error;
  }
}

// Export a function that ensures DB is ready before any operation
export async function ensureDbReady(): Promise<void> {
  await initializeDatabase();
}
