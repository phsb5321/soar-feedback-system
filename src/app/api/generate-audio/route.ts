import {
  checkAudioFilesExist,
  generateAllAudioMessages,
} from "@/services/OpenAITTSService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const forceRegenerate = body.forceRegenerate === true;

    // Check if audio files already exist (unless forcing regeneration)
    if (!forceRegenerate && checkAudioFilesExist()) {
      return NextResponse.json({
        message: "Audio files already exist",
        status: "success",
      });
    }

    const actionMessage = forceRegenerate
      ? "Regenerating high-quality audio files..."
      : "Generating audio files...";

    console.log(actionMessage);
    const audioUrls = await generateAllAudioMessages(forceRegenerate);

    return NextResponse.json({
      message: forceRegenerate
        ? "Audio files regenerated successfully with improved quality"
        : "Audio files generated successfully",
      audioUrls,
      status: "success",
      regenerated: forceRegenerate,
    });
  } catch (error) {
    console.error("Error generating audio files:", error);
    return NextResponse.json(
      {
        error: "Failed to generate audio files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const audioFilesExist = checkAudioFilesExist();

    return NextResponse.json({
      audioFilesExist,
      status: "success",
    });
  } catch (error) {
    console.error("Error checking audio files:", error);
    return NextResponse.json(
      {
        error: "Failed to check audio files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
