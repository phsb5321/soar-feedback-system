#!/usr/bin/env tsx

import { sql } from "drizzle-orm";
import { closeConnections, db, testConnection } from "../drizzle/config";
import { feedback } from "../drizzle/schema";

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "test":
      await testConnectionCommand();
      break;
    case "migrate":
      await migrateCommand();
      break;
    case "seed":
      await seedCommand();
      break;
    case "status":
      await statusCommand();
      break;
    case "cleanup":
      await cleanupCommand();
      break;
    default:
      console.log(`
Database Utility Commands:

  npm run db:test       - Test database connection
  npm run db:migrate    - Run database migrations
  npm run db:seed       - Seed database with sample data
  npm run db:status     - Show database status
  npm run db:cleanup    - Clean up test data

Available commands: test, migrate, seed, status, cleanup
      `);
  }

  await closeConnections();
  process.exit(0);
}

async function testConnectionCommand() {
  console.log("🔍 Testing database connection...");
  const isConnected = await testConnection();
  if (isConnected) {
    console.log("✅ Database connection successful!");
  } else {
    console.log("❌ Database connection failed!");
    process.exit(1);
  }
}

async function migrateCommand() {
  console.log("🔄 Running database migrations...");
  try {
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
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

async function seedCommand() {
  console.log("🌱 Seeding database with sample data...");
  try {
    const sampleData = [
      {
        audio_url: "sample_audio_1.webm",
        transcription:
          "This is a sample feedback transcription about the excellent service quality.",
        csat: 9,
        additional_comment: "The team was very helpful and responsive.",
      },
      {
        audio_url: "sample_audio_2.webm",
        transcription:
          "I had some issues with the product delivery, but customer service resolved it quickly.",
        csat: 7,
        additional_comment: "Room for improvement in delivery times.",
      },
      {
        audio_url: "sample_audio_3.webm",
        transcription:
          "Outstanding experience! Everything worked perfectly from start to finish.",
        csat: 10,
        additional_comment: "Will definitely recommend to others.",
      },
    ];

    for (const data of sampleData) {
      await db.insert(feedback).values(data);
    }

    console.log(`✅ Seeded ${sampleData.length} sample records!`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

async function statusCommand() {
  console.log("📊 Database Status Report");
  console.log("========================");

  try {
    // Connection test
    const isConnected = await testConnection();
    console.log(`Connection: ${isConnected ? "✅ Connected" : "❌ Failed"}`);

    // Database version
    const versionResult = await db.execute(sql`SELECT version()`);
    const version =
      versionResult.rows?.[0]?.version?.toString().split(" ")[0] || "unknown";
    console.log(`Database: ${version}`);

    // Table status
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
      ) as exists
    `);
    console.log(
      `Feedback Table: ${
        tableExists.rows?.[0]?.exists ? "✅ Exists" : "❌ Missing"
      }`
    );

    // Record count
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(feedback);
    console.log(`Total Records: ${countResult[0]?.count || 0}`);

    // Recent records
    const recentRecords = await db
      .select()
      .from(feedback)
      .orderBy(sql`created_at DESC`)
      .limit(3);

    console.log("\n📝 Recent Feedback:");
    recentRecords.forEach((record, index) => {
      console.log(
        `${index + 1}. ID: ${record.id}, Score: ${
          record.csat || "N/A"
        }, Date: ${record.created_at?.toISOString().split("T")[0]}`
      );
    });
  } catch (error) {
    console.error("❌ Status check failed:", error);
    process.exit(1);
  }
}

async function cleanupCommand() {
  console.log("🧹 Cleaning up test data...");
  try {
    const result = await db.execute(sql`
      DELETE FROM feedback 
      WHERE audio_url LIKE 'test%' 
      OR audio_url LIKE 'sample%'
      OR transcription LIKE '%test%'
    `);
    console.log(`✅ Cleaned up ${result.rowCount} test records!`);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
