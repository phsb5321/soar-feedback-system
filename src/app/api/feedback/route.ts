import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, testConnection } from "../../../../drizzle/config";
import { feedback } from "../../../../drizzle/schema";
import { ensureDbReady } from "../../../lib/db-init";
import { aiFeedbackAnalysisService } from "../../../services/AiFeedbackAnalysisService";

export async function POST(req: NextRequest) {
  try {
    // Ensure database is initialized and ready
    await ensureDbReady();

    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Database connection failed");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 },
      );
    }

    const body = await req.json();
    const { transcription, npsScore, additionalComment } = body;

    // Validate required fields
    if (!transcription) {
      return NextResponse.json(
        { error: "Transcription is required" },
        { status: 400 },
      );
    }

    // Validate npsScore if provided
    if (npsScore !== undefined && (npsScore < 0 || npsScore > 10)) {
      return NextResponse.json(
        { error: "NPS Score must be between 0 and 10" },
        { status: 400 },
      );
    }

    // For now, we'll store a placeholder for audio_url since we're not implementing file storage
    // In a real application, you would upload the audio blob to cloud storage and store the URL
    const audioUrl = `audio_${Date.now()}.webm`; // Placeholder

    console.log("Saving feedback to database:", {
      audioUrl,
      transcription: transcription.substring(0, 50) + "...",
      npsScore,
      additionalComment: additionalComment?.substring(0, 50) + "...",
    });

    // First, save the basic feedback
    const result = await db
      .insert(feedback)
      .values({
        audio_url: audioUrl,
        transcription,
        csat: npsScore,
        additional_comment: additionalComment,
        ai_processed: false,
      })
      .returning();

    const feedbackId = result[0].id;
    console.log("Feedback saved successfully with ID:", feedbackId);

    // Then run AI analysis in the background (non-blocking)
    setImmediate(async () => {
      try {
        console.log(`Starting AI analysis for feedback ${feedbackId}...`);

        const aiAnalysis = await aiFeedbackAnalysisService.analyzeFeedback(
          transcription,
          npsScore,
        );

        // Update the feedback record with AI analysis
        await db
          .update(feedback)
          .set({
            ai_tags: aiAnalysis.tags,
            ai_sentiment: aiAnalysis.sentiment,
            ai_sentiment_confidence: aiAnalysis.sentimentConfidence,
            ai_emotion: aiAnalysis.emotion,
            ai_emotion_confidence: aiAnalysis.emotionConfidence,
            ai_topics: aiAnalysis.topics,
            ai_key_phrases: aiAnalysis.keyPhrases,
            ai_language: aiAnalysis.language,
            ai_language_confidence: aiAnalysis.languageConfidence,
            ai_urgency_score: aiAnalysis.urgencyScore,
            ai_satisfaction_prediction: aiAnalysis.satisfactionPrediction,
            ai_intent: aiAnalysis.intent,
            ai_intent_confidence: aiAnalysis.intentConfidence,
            ai_word_count: aiAnalysis.wordCount,
            ai_character_count: aiAnalysis.characterCount,
            ai_readability_score: aiAnalysis.readabilityScore,
            ai_formality_score: aiAnalysis.formalityScore,
            ai_processed: true,
            ai_processing_error: aiAnalysis.processingError || null,
            ai_model_version: aiAnalysis.modelVersion,
            ai_processed_at: aiAnalysis.processedAt,
            ai_summary: aiAnalysis.summary,
            ai_action_items: aiAnalysis.actionItems,
            ai_priority_level: aiAnalysis.priorityLevel,
            ai_department: aiAnalysis.department,
            ai_product_mentions: aiAnalysis.productMentions,
            ai_competitor_mentions: aiAnalysis.competitorMentions,
            ai_feature_requests: aiAnalysis.featureRequests,
            ai_bug_reports: aiAnalysis.bugReports,
            ai_compliance_flags: aiAnalysis.complianceFlags,
            ai_follow_up_required: aiAnalysis.followUpRequired,
            ai_follow_up_reason: aiAnalysis.followUpReason || null,
            ai_customer_type: aiAnalysis.customerType,
            ai_interaction_quality: aiAnalysis.interactionQuality,
          })
          .where(eq(feedback.id, feedbackId));

        console.log(`AI analysis completed for feedback ${feedbackId}`);
      } catch (aiError) {
        console.error(
          `AI analysis failed for feedback ${feedbackId}:`,
          aiError,
        );

        // Update with error status
        await db
          .update(feedback)
          .set({
            ai_processed: true,
            ai_processing_error:
              aiError instanceof Error
                ? aiError.message
                : "Unknown AI analysis error",
            ai_processed_at: new Date(),
          })
          .where(eq(feedback.id, feedbackId));
      }
    });

    return NextResponse.json({
      success: true,
      id: result[0].id,
      message: "Feedback saved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Feedback API error:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("connection")) {
        return NextResponse.json(
          { error: "Database connection error" },
          { status: 503 },
        );
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Database timeout error" },
          { status: 504 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 },
    );
  }
}

// GET endpoint to retrieve feedback (for testing/admin purposes)
export async function GET(req: NextRequest) {
  try {
    // Ensure database is initialized and ready
    await ensureDbReady();

    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 },
      );
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const results = await db
      .select()
      .from(feedback)
      .orderBy(feedback.created_at)
      .limit(limit)
      .offset(offset);

    const totalCount = await db.select({ count: feedback.id }).from(feedback);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        limit,
        offset,
        total: totalCount.length,
      },
    });
  } catch (error) {
    console.error("Feedback GET API error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 },
    );
  }
}
