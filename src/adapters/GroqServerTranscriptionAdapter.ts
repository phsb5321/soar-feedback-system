import fs from "fs";
import Groq from "groq-sdk";

/**
 * Server-side adapter for Groq transcription service
 * Works with file paths instead of Blobs for server-side usage
 */
export class GroqServerTranscriptionAdapter {
  private groq: Groq;

  constructor(apiKey: string) {
    this.groq = new Groq({ apiKey });
  }

  async transcribeAudioFile(filePath: string): Promise<string> {
    try {
      const transcription = await this.groq.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-large-v3",
        response_format: "verbose_json",
      });

      if (!transcription.text) {
        throw new Error('No transcription text received from Groq service');
      }

      return transcription.text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Groq transcription error: ${error.message}`);
      }
      throw new Error('Unknown error occurred during Groq transcription');
    }
  }
}
