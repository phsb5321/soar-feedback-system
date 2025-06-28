import fs from "fs";
import Groq from "groq-sdk";
import { TranscriptionPort } from "../ports/TranscriptionPort";

export class GroqTranscriptionAdapter implements TranscriptionPort {
  private groq: Groq;
  constructor(apiKey: string) {
    this.groq = new Groq({ apiKey });
  }

  async transcribeAudio(filePath: string): Promise<string> {
    const transcription = await this.groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });
    return transcription.text;
  }
}
