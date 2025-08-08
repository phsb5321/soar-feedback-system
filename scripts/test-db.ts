#!/usr/bin/env tsx

import { sql } from "drizzle-orm";
import { db, testConnection, closeConnections } from "../drizzle/config";

/**
 * Simple database test script to verify connection and table operations
 * This script helps debug database connectivity and schema issues
 */

async function main() {
  console.log("🧪 Starting database connection test...");
  console.log("=====================================");

  try {
    // Step 1: Test basic connection
    console.log("🔌 Testing database connection...");
    const isConnected = await testConnection();

    if (!isConnected) {
      console.error("❌ Database connection failed!");
      process.exit(1);
    }

    console.log("✅ Database connection successful!");

    // Step 2: Get database info
    console.log("\n📋 Getting database information...");
    const dbInfo = await db.execute(sql`
      SELECT
        current_database() as db_name,
        current_schema() as schema_name,
        version() as db_version;
    `);

    const info = dbInfo.rows?.[0];
    console.log(`   Database: ${info?.db_name}`);
    console.log(`   Schema: ${info?.schema_name}`);
    console.log(`   Version: ${info?.db_version?.split(' ')[0]}`);

    // Step 3: Set search path to public
    console.log("\n🔧 Setting search path to public schema...");
    await db.execute(sql`SET search_path TO public;`);

    // Step 4: Check if feedback table exists
    console.log("\n🔍 Checking for existing feedback table...");
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'feedback'
      ) as exists;
    `);

    const exists = Boolean(tableExists.rows?.[0]?.exists);
    console.log(`   Feedback table exists: ${exists}`);

    if (exists) {
      // Check table structure
      console.log("\n📊 Checking table structure...");
      const columns = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'feedback'
        ORDER BY ordinal_position;
      `);

      console.log("   Columns:");
      columns.rows?.forEach(col => {
        console.log(`     - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
      });

      // Test table access
      console.log("\n🔍 Testing table access...");
      try {
        const count = await db.execute(sql`SELECT COUNT(*) as count FROM feedback;`);
        console.log(`   Records in table: ${count.rows?.[0]?.count}`);
        console.log("✅ Table is accessible");
      } catch (error) {
        console.error("❌ Table access failed:", error);
      }
    }

    // Step 5: Test table creation (if it doesn't exist)
    if (!exists) {
      console.log("\n🏗️  Creating feedback table...");

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

      console.log("✅ Table created successfully!");

      // Verify creation
      const newTableExists = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'feedback'
        ) as exists;
      `);

      const nowExists = Boolean(newTableExists.rows?.[0]?.exists);
      console.log(`   Table verification: ${nowExists ? 'SUCCESS' : 'FAILED'}`);
    }

    // Step 6: Test insert operation
    console.log("\n💾 Testing insert operation...");
    try {
      await db.execute(sql`BEGIN;`);

      const insertResult = await db.execute(sql`
        INSERT INTO feedback (audio_url, transcription, csat, additional_comment)
        VALUES ('test_audio.webm', 'Test transcription', 10, 'Test comment')
        RETURNING id;
      `);

      const insertedId = insertResult.rows?.[0]?.id;
      console.log(`   Test record inserted with ID: ${insertedId}`);

      // Rollback the test insert
      await db.execute(sql`ROLLBACK;`);
      console.log("✅ Insert test successful (rolled back)");

    } catch (error) {
      await db.execute(sql`ROLLBACK;`);
      console.error("❌ Insert test failed:", error);
    }

    console.log("\n🎉 Database test completed successfully!");

  } catch (error) {
    console.error("💥 Database test failed:", error);
    process.exit(1);
  } finally {
    await closeConnections();
  }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 Received SIGTERM, closing database connections...");
  await closeConnections();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🔄 Received SIGINT, closing database connections...");
  await closeConnections();
  process.exit(0);
});

main().catch(async (error) => {
  console.error("💥 Test script failed:", error);
  await closeConnections();
  process.exit(1);
});
