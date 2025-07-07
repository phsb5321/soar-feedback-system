import { NextRequest, NextResponse } from "next/server";
import { db, testConnection } from "../../../../drizzle/config";
import { feedback } from "../../../../drizzle/schema";

export async function POST(req: NextRequest) {
  try {
    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Database connection failed");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { transcription, npsScore, additionalComment } = body;

    // Validate required fields
    if (!transcription) {
      return NextResponse.json(
        { error: "Transcription is required" },
        { status: 400 }
      );
    }

    // Validate npsScore if provided
    if (npsScore !== undefined && (npsScore < 0 || npsScore > 10)) {
      return NextResponse.json(
        { error: "NPS Score must be between 0 and 10" },
        { status: 400 }
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

    const result = await db
      .insert(feedback)
      .values({
        audio_url: audioUrl,
        transcription,
        csat: npsScore,
        additional_comment: additionalComment,
      })
      .returning();

    console.log("Feedback saved successfully with ID:", result[0].id);

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
          { status: 503 }
        );
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Database timeout error" },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve feedback (for testing/admin purposes)
export async function GET(req: NextRequest) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
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
      { status: 500 }
    );
  }
}
