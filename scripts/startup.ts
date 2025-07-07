#!/usr/bin/env tsx

import { sql } from "drizzle-orm";
import { closeConnections, db, testConnection } from "../drizzle/config";
import { feedback } from "../drizzle/schema";

/**
 * Startup script for deployment validation
 * This script runs after deployment to:
 * 1. Test database connection
 * 2. Validate table existence
 * 3. Run migrations if needed
 * 4. Provide deployment health check
 */

async function main() {
  console.log("🚀 Starting deployment validation...");
  console.log("====================================");

  let hasErrors = false;

  try {
    // Step 1: Test database connection
    console.log("🔍 Testing database connection...");
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error("❌ Database connection failed!");
      hasErrors = true;
    } else {
      console.log("✅ Database connection successful!");
    }

    // Step 2: Check database version and basic info
    console.log("📋 Getting database information...");
    const versionResult = await db.execute(sql`SELECT version()`);
    const version = versionResult.rows?.[0]?.version?.toString().split(" ")[0] || "unknown";
    console.log(`   Database: ${version}`);

    // Step 3: Check if tables exist
    console.log("🔍 Checking table existence...");
    const tableExists = await checkTableExists();
    
    if (!tableExists) {
      console.log("⚠️  Feedback table doesn't exist, running migrations...");
      await runMigrations();
    } else {
      console.log("✅ Feedback table exists");
      
      // Check if table structure is correct
      const isStructureValid = await validateTableStructure();
      if (!isStructureValid) {
        console.log("⚠️  Table structure needs updating, running migrations...");
        await runMigrations();
      } else {
        console.log("✅ Table structure is valid");
      }
    }

    // Step 4: Final health check
    console.log("🏥 Running final health check...");
    await performHealthCheck();

    if (!hasErrors) {
      console.log("🎉 Deployment validation completed successfully!");
      console.log("🌐 Application is ready to serve requests");
    } else {
      console.error("❌ Deployment validation failed!");
      process.exit(1);
    }

  } catch (error) {
    console.error("💥 Deployment validation failed with error:", error);
    process.exit(1);
  } finally {
    await closeConnections();
  }
}

async function checkTableExists(): Promise<boolean> {
  try {
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
      ) as exists
    `);
    return Boolean(result.rows?.[0]?.exists);
  } catch (error) {
    console.error("Error checking table existence:", error);
    return false;
  }
}

async function validateTableStructure(): Promise<boolean> {
  try {
    // Check if all required columns exist
    const columns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'feedback'
      ORDER BY ordinal_position
    `);

    const requiredColumns = [
      { name: 'id', type: 'integer', nullable: 'NO' },
      { name: 'audio_url', type: 'text', nullable: 'NO' },
      { name: 'transcription', type: 'text', nullable: 'NO' },
      { name: 'csat', type: 'integer', nullable: 'YES' },
      { name: 'additional_comment', type: 'text', nullable: 'YES' },
      { name: 'created_at', type: 'timestamp without time zone', nullable: 'NO' }
    ];

    const existingColumns = columns.rows?.map(row => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable
    })) || [];

    for (const requiredCol of requiredColumns) {
      const existingCol = existingColumns.find(col => col.name === requiredCol.name);
      if (!existingCol) {
        console.log(`   Missing column: ${requiredCol.name}`);
        return false;
      }
      if (existingCol.type !== requiredCol.type) {
        console.log(`   Column type mismatch: ${requiredCol.name} (expected: ${requiredCol.type}, got: ${existingCol.type})`);
        return false;
      }
    }

    console.log(`   All ${requiredColumns.length} columns are present and valid`);
    return true;
  } catch (error) {
    console.error("Error validating table structure:", error);
    return false;
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

    // Add any indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_csat ON feedback(csat) WHERE csat IS NOT NULL;
    `);

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

async function performHealthCheck(): Promise<void> {
  try {
    // Test basic CRUD operations
    console.log("   Testing basic database operations...");
    
    // Test SELECT
    const testSelect = await db.execute(sql`SELECT 1 as test`);
    if (testSelect.rows?.[0]?.test !== 1) {
      throw new Error("Basic SELECT test failed");
    }

    // Test feedback table access
    const count = await db.select({ count: sql<number>`count(*)::int` }).from(feedback);
    console.log(`   Current feedback records: ${count[0]?.count || 0}`);

    // Test INSERT/DELETE (with rollback)
    await db.execute(sql`BEGIN`);
    try {
      await db.insert(feedback).values({
        audio_url: "health_check_test.webm",
        transcription: "Health check test record",
        csat: 10,
        additional_comment: "This is a test record for health check"
      });
      
      await db.execute(sql`ROLLBACK`);
      console.log("   Database operations test passed");
    } catch (error) {
      await db.execute(sql`ROLLBACK`);
      throw error;
    }

    console.log("✅ Health check completed successfully!");
  } catch (error) {
    console.error("❌ Health check failed:", error);
    throw error;
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Received SIGTERM, closing database connections...');
  await closeConnections();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Received SIGINT, closing database connections...');
  await closeConnections();
  process.exit(0);
});

main().catch(async (error) => {
  console.error("💥 Startup script failed:", error);
  await closeConnections();
  process.exit(1);
});
