import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  audio_url: text("audio_url").notNull(), // URL or path to audio file (if stored)
  transcription: text("transcription").notNull(),
  csat: integer("csat"), // Customer Satisfaction (0-10)
  additional_comment: text("additional_comment"),
  created_at: timestamp("created_at").defaultNow().notNull(),

  // AI-powered analytics fields
  ai_tags: jsonb("ai_tags").$type<string[]>(), // AI-generated tags
  ai_sentiment: text("ai_sentiment"), // positive, negative, neutral
  ai_sentiment_confidence: real("ai_sentiment_confidence"), // 0.0 to 1.0
  ai_emotion: text("ai_emotion"), // joy, anger, sadness, fear, surprise, disgust
  ai_emotion_confidence: real("ai_emotion_confidence"), // 0.0 to 1.0
  ai_topics: jsonb("ai_topics").$type<string[]>(), // AI-detected topics/categories
  ai_key_phrases: jsonb("ai_key_phrases").$type<string[]>(), // Important phrases extracted
  ai_language: text("ai_language"), // Detected language (pt, en, es, etc.)
  ai_language_confidence: real("ai_language_confidence"), // 0.0 to 1.0
  ai_urgency_score: real("ai_urgency_score"), // 0.0 to 1.0 (how urgent/critical)
  ai_satisfaction_prediction: real("ai_satisfaction_prediction"), // AI predicted CSAT if not provided
  ai_intent: text("ai_intent"), // complaint, praise, suggestion, question, etc.
  ai_intent_confidence: real("ai_intent_confidence"), // 0.0 to 1.0
  ai_word_count: integer("ai_word_count"), // Number of words in transcription
  ai_character_count: integer("ai_character_count"), // Number of characters
  ai_readability_score: real("ai_readability_score"), // Text complexity score
  ai_formality_score: real("ai_formality_score"), // How formal vs casual (0.0 to 1.0)
  ai_processed: boolean("ai_processed").default(false), // Whether AI analysis is complete
  ai_processing_error: text("ai_processing_error"), // Any errors during AI processing
  ai_model_version: text("ai_model_version"), // Version of AI model used
  ai_processed_at: timestamp("ai_processed_at"), // When AI processing completed
  ai_summary: text("ai_summary"), // AI-generated summary of the feedback
  ai_action_items: jsonb("ai_action_items").$type<string[]>(), // Suggested action items
  ai_priority_level: text("ai_priority_level"), // low, medium, high, critical
  ai_department: text("ai_department"), // Suggested department to handle this
  ai_product_mentions: jsonb("ai_product_mentions").$type<string[]>(), // Products/services mentioned
  ai_competitor_mentions: jsonb("ai_competitor_mentions").$type<string[]>(), // Competitors mentioned
  ai_feature_requests: jsonb("ai_feature_requests").$type<string[]>(), // Feature requests identified
  ai_bug_reports: jsonb("ai_bug_reports").$type<string[]>(), // Bug reports identified
  ai_compliance_flags: jsonb("ai_compliance_flags").$type<string[]>(), // Compliance/legal issues
  ai_follow_up_required: boolean("ai_follow_up_required"), // Whether follow-up is needed
  ai_follow_up_reason: text("ai_follow_up_reason"), // Why follow-up is needed
  ai_customer_type: text("ai_customer_type"), // new, returning, power_user, etc.
  ai_interaction_quality: real("ai_interaction_quality"), // Overall interaction quality (0.0 to 1.0)
});

export type Feedback = typeof feedback.$inferSelect;
export type NewFeedback = typeof feedback.$inferInsert;
