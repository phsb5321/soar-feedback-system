import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { GroqTranscriptionAdapter } from "../../../adapters/GroqTranscriptionAdapter";

// Remove or set to 'nodejs' to use Node.js runtime
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("audio") as File;
  if (!file) {
    return NextResponse.json(
      { error: "No audio file provided" },
      { status: 400 }
    );
  }

  // Save the file temporarily
  const tempPath = path.join("/tmp", `${Date.now()}-audio.webm`);
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(tempPath, Buffer.from(arrayBuffer));

  // Use GroqTranscriptionAdapter
  const groq = new GroqTranscriptionAdapter(process.env.GROQ_API_KEY!);
  const text = await groq.transcribeAudio(tempPath);

  // Clean up
  await fs.unlink(tempPath);

  return NextResponse.json({ text });
}
