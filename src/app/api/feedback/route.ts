import { NextRequest, NextResponse } from "next/server";
import { getDb } from '../../../../drizzle/config';
import { feedback } from '../../../../drizzle/schema';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcription, npsScore, additionalComment } = body;

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // For now, we'll store a placeholder for audio_url since we're not implementing file storage
    // In a real application, you would upload the audio blob to cloud storage and store the URL
    const audioUrl = `audio_${Date.now()}.webm`; // Placeholder
    
    const result = await db.insert(feedback).values({
      audio_url: audioUrl,
      transcription,
      csat: npsScore,
      additional_comment: additionalComment,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      id: result[0].id,
      message: 'Feedback saved successfully' 
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
} 