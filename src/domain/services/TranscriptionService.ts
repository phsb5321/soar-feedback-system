// Domain Service: TranscriptionService
import { AudioRecording } from "@/domain/AudioRecording";
import { TranscriptionPort } from "@/ports/TranscriptionPort";

export class TranscriptionService {
  constructor(private transcriptionPort: TranscriptionPort) {}

  async transcribeRecording(recording: AudioRecording): Promise<string> {
    if (!recording.isValid()) {
      throw new Error("Invalid audio recording");
    }

    // Convert blob to temporary file path for transcription
    // This is a simplified approach - in production, you might want to handle this differently
    const tempFilePath = await this.saveTempFile(recording.blob);

    try {
      const transcription = await this.transcriptionPort.transcribeAudio(
        tempFilePath
      );
      return transcription || "Sem resultado na transcrição.";
    } catch (error) {
      throw new Error("Erro ao transcrever áudio: " + (error as Error).message);
    }
  }

  private async saveTempFile(blob: Blob): Promise<string> {
    // This is a placeholder - in a real implementation, you'd save to a temp directory
    // For now, we'll return a mock path since the actual implementation depends on the adapter
    // The blob parameter is used conceptually here for future implementation
    console.log("Saving blob of size:", blob.size);
    return "temp_audio_file.webm";
  }
}
