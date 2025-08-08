#!/usr/bin/env tsx

import { sql } from "drizzle-orm";
import { db, testConnection, closeConnections } from "../drizzle/config";

/**
 * Migration script to add AI analysis fields to the feedback table
 *
 * This script adds comprehensive AI-powered analytics fields to extract
 * valuable insights from user feedback transcriptions.
 */

async function migrateAiFields(): Promise<void> {
  console.log("🔄 Starting AI fields migration...");
  console.log("=".repeat(50));

  try {
    // Test database connection
    console.log("🔌 Testing database connection...");
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Database connection failed");
    }
    console.log("✅ Database connection successful");

    // Set search path
    await db.execute(sql`SET search_path TO public;`);

    console.log("\n📊 Adding AI analysis fields to feedback table...");

    // Add all AI-powered analytics fields
    await db.execute(sql`
      ALTER TABLE feedback
      ADD COLUMN IF NOT EXISTS ai_tags JSONB,
      ADD COLUMN IF NOT EXISTS ai_sentiment TEXT,
      ADD COLUMN IF NOT EXISTS ai_sentiment_confidence REAL,
      ADD COLUMN IF NOT EXISTS ai_emotion TEXT,
      ADD COLUMN IF NOT EXISTS ai_emotion_confidence REAL,
      ADD COLUMN IF NOT EXISTS ai_topics JSONB,
      ADD COLUMN IF NOT EXISTS ai_key_phrases JSONB,
      ADD COLUMN IF NOT EXISTS ai_language TEXT,
      ADD COLUMN IF NOT EXISTS ai_language_confidence REAL,
      ADD COLUMN IF NOT EXISTS ai_urgency_score REAL,
      ADD COLUMN IF NOT EXISTS ai_satisfaction_prediction REAL,
      ADD COLUMN IF NOT EXISTS ai_intent TEXT,
      ADD COLUMN IF NOT EXISTS ai_intent_confidence REAL,
      ADD COLUMN IF NOT EXISTS ai_word_count INTEGER,
      ADD COLUMN IF NOT EXISTS ai_character_count INTEGER,
      ADD COLUMN IF NOT EXISTS ai_readability_score REAL,
      ADD COLUMN IF NOT EXISTS ai_formality_score REAL,
      ADD COLUMN IF NOT EXISTS ai_processed BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS ai_processing_error TEXT,
      ADD COLUMN IF NOT EXISTS ai_model_version TEXT,
      ADD COLUMN IF NOT EXISTS ai_processed_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS ai_summary TEXT,
      ADD COLUMN IF NOT EXISTS ai_action_items JSONB,
      ADD COLUMN IF NOT EXISTS ai_priority_level TEXT,
      ADD COLUMN IF NOT EXISTS ai_department TEXT,
      ADD COLUMN IF NOT EXISTS ai_product_mentions JSONB,
      ADD COLUMN IF NOT EXISTS ai_competitor_mentions JSONB,
      ADD COLUMN IF NOT EXISTS ai_feature_requests JSONB,
      ADD COLUMN IF NOT EXISTS ai_bug_reports JSONB,
      ADD COLUMN IF NOT EXISTS ai_compliance_flags JSONB,
      ADD COLUMN IF NOT EXISTS ai_follow_up_required BOOLEAN,
      ADD COLUMN IF NOT EXISTS ai_follow_up_reason TEXT,
      ADD COLUMN IF NOT EXISTS ai_customer_type TEXT,
      ADD COLUMN IF NOT EXISTS ai_interaction_quality REAL;
    `);

    console.log("✅ AI fields added successfully");

    // Add indexes for better query performance
    console.log("\n📈 Creating indexes for AI fields...");

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_sentiment
      ON feedback(ai_sentiment) WHERE ai_sentiment IS NOT NULL;
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_intent
      ON feedback(ai_intent) WHERE ai_intent IS NOT NULL;
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_priority
      ON feedback(ai_priority_level) WHERE ai_priority_level IS NOT NULL;
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_department
      ON feedback(ai_department) WHERE ai_department IS NOT NULL;
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_processed
      ON feedback(ai_processed);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_urgency
      ON feedback(ai_urgency_score) WHERE ai_urgency_score IS NOT NULL;
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_follow_up
      ON feedback(ai_follow_up_required) WHERE ai_follow_up_required IS NOT NULL;
    `);

    // GIN indexes for JSONB fields for better search performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_tags_gin
      ON feedback USING GIN(ai_tags) WHERE ai_tags IS NOT NULL;
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_topics_gin
      ON feedback USING GIN(ai_topics) WHERE ai_topics IS NOT NULL;
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_ai_product_mentions_gin
      ON feedback USING GIN(ai_product_mentions) WHERE ai_product_mentions IS NOT NULL;
    `);

    console.log("✅ Indexes created successfully");

    // Add constraints for data integrity (skip constraints as they're not critical for functionality)
    console.log(
      "\n🔒 Skipping data constraints (optional for this migration)...",
    );
    console.log("✅ Migration completed without optional constraints");

    // Verify the migration by checking table structure
    console.log("\n🔍 Verifying migration...");
    const columns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'feedback'
      AND column_name LIKE 'ai_%'
      ORDER BY column_name;
    `);

    console.log(
      `✅ Migration verified: ${columns.rows.length} AI fields added`,
    );

    // Show some of the added fields
    const aiFields = columns.rows
      .slice(0, 10)
      .map((row) => row.column_name)
      .join(", ");
    console.log(`📊 Sample AI fields: ${aiFields}...`);

    console.log("\n🎉 AI fields migration completed successfully!");
    console.log(
      "📈 The feedback table now supports comprehensive AI-powered analytics",
    );
    console.log("\n🚀 Next steps:");
    console.log(
      "   1. Run the mega-seed script to populate with analyzed data",
    );
    console.log("   2. Use the AI analysis service in your application");
    console.log("   3. Build dashboards to visualize the insights");
  } catch (error) {
    console.error("💥 Migration failed:", error);
    throw error;
  } finally {
    await closeConnections();
  }
}

/**
 * Handle script execution
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log("SOAR Feedback System - AI Fields Migration");
    console.log("");
    console.log("Usage:");
    console.log(
      "  tsx scripts/migrate-ai-fields.ts           Run the AI fields migration",
    );
    console.log("  tsx scripts/migrate-ai-fields.ts --help    Show this help");
    console.log("");
    console.log(
      "This migration adds comprehensive AI analysis fields to the feedback table:",
    );
    console.log("• Sentiment analysis (sentiment, confidence)");
    console.log("• Emotion detection (emotion, confidence)");
    console.log("• Content analysis (topics, tags, key phrases)");
    console.log("• Intent classification (intent, confidence)");
    console.log("• Language detection (language, confidence)");
    console.log("• Business intelligence (urgency, priority, department)");
    console.log("• Entity extraction (products, competitors, features, bugs)");
    console.log("• Customer insights (type, interaction quality)");
    console.log("• Actionable items and summaries");
    console.log("");
    console.log("Requirements:");
    console.log("• DATABASE_URL environment variable must be set");
    process.exit(0);
  }

  migrateAiFields().catch((error) => {
    console.error("💥 Migration script failed:", error);
    process.exit(1);
  });
}

export { migrateAiFields };
