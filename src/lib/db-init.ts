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

    // Verify we're connected to the correct database and schema
    await verifyDatabaseContext();

    // Check if feedback table exists
    const tableExists = await checkTableExists();

    if (!tableExists) {
      console.log("⚠️  Feedback table doesn't exist, creating it...");
      await runMigrations();

      // Verify table was created successfully
      const tableCreated = await checkTableExists();
      if (!tableCreated) {
        throw new Error(
          "Failed to create feedback table - table not found after migration",
        );
      }

      console.log("✅ Database initialized successfully");
    } else {
      console.log("✅ Database schema is up to date");
    }
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    // Don't throw in production - let the app continue and handle DB errors gracefully
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  }
}

async function verifyDatabaseContext(): Promise<void> {
  try {
    // Get current database name and schema
    const dbInfo = await db.execute(sql`
      SELECT current_database() as db_name, current_schema() as schema_name;
    `);

    const dbName = dbInfo.rows?.[0]?.db_name;
    const schemaName = dbInfo.rows?.[0]?.schema_name;

    console.log(`📍 Connected to database: ${dbName}, schema: ${schemaName}`);

    // Ensure we're in the public schema
    if (schemaName !== "public") {
      console.log("🔄 Setting search path to public schema...");
      await db.execute(sql`SET search_path TO public;`);
    }
  } catch (error) {
    console.warn("Warning verifying database context:", error);
  }
}

async function checkTableExists(): Promise<boolean> {
  try {
    // Use information_schema to check table existence more reliably
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'feedback'
      ) as exists;
    `);

    const exists = Boolean(result.rows?.[0]?.exists);

    if (exists) {
      console.log("✅ Feedback table exists");
      // Also verify we can access it
      try {
        await db.execute(sql`SELECT 1 FROM feedback LIMIT 1;`);
        console.log("✅ Feedback table is accessible");
      } catch (accessError) {
        console.warn(
          "⚠️  Feedback table exists but is not accessible:",
          accessError,
        );
      }
    } else {
      console.log("⚠️  Feedback table does not exist");
    }

    return exists;
  } catch (error: unknown) {
    const dbError = error as { code?: string; message?: string };
    console.warn(
      "Warning checking table existence:",
      dbError.message || String(error),
    );
    return false;
  }
}

async function runMigrations(): Promise<void> {
  try {
    console.log("🔄 Running database migrations...");

    // Ensure we're in the public schema
    await db.execute(sql`SET search_path TO public;`);

    // Check if table exists first
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'feedback'
      ) as exists;
    `);

    const exists = Boolean(tableExists.rows?.[0]?.exists);

    if (exists) {
      console.log("🔧 Table exists, checking if column type needs fixing...");

      // Check the created_at column type
      const columnInfo = await db.execute(sql`
        SELECT data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'feedback'
        AND column_name = 'created_at';
      `);

      const currentType = columnInfo.rows?.[0]?.data_type;
      console.log(`   Current created_at type: ${currentType}`);

      if (currentType === "timestamp with time zone") {
        console.log(
          "🔄 Converting timestamp with time zone to timestamp without time zone...",
        );

        // Convert the column type while preserving data
        await db.execute(sql`
          ALTER TABLE feedback
          ALTER COLUMN created_at TYPE TIMESTAMP WITHOUT TIME ZONE
          USING created_at AT TIME ZONE 'UTC';
        `);

        console.log("✅ Column type converted successfully!");
      }

      // Ensure indexes exist
      console.log("📊 Ensuring indexes exist...");
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
      `);

      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS idx_feedback_csat ON feedback(csat) WHERE csat IS NOT NULL;
      `);
    } else {
      // Create the feedback table with proper structure
      console.log("🏗️  Creating feedback table...");
      await db.execute(sql`
        CREATE TABLE feedback (
          id SERIAL PRIMARY KEY,
          audio_url TEXT NOT NULL,
          transcription TEXT NOT NULL,
          csat INTEGER,
          additional_comment TEXT,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
        );
      `);

      // Add indexes for better performance
      console.log("📊 Creating indexes...");
      await db.execute(sql`
        CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
      `);

      await db.execute(sql`
        CREATE INDEX idx_feedback_csat ON feedback(csat) WHERE csat IS NOT NULL;
      `);
    }

    // Verify the table structure is now correct
    console.log("🔍 Verifying final table structure...");
    const tableInfo = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'feedback'
      ORDER BY ordinal_position;
    `);

    console.log("📋 Final table structure:", tableInfo.rows);

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
