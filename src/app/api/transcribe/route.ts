import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { GroqServerTranscriptionAdapter } from "../../../adapters/GroqServerTranscriptionAdapter";

// Remove or set to 'nodejs' to use Node.js runtime
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // Save the file temporarily
    const tempPath = path.join("/tmp", `${Date.now()}-audio.webm`);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

    // Use GroqServerTranscriptionAdapter
    const groq = new GroqServerTranscriptionAdapter(process.env.GROQ_API_KEY!);
    const text = await groq.transcribeAudioFile(tempPath);

    // Clean up
    await fs.unlink(tempPath);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Transcription API error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 },
    );
  }
}
