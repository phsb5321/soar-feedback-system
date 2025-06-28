// Application Use Case: TranscribeAudio
import { AudioRecording } from "@/domain/AudioRecording";
import { TranscriptionService } from "@/domain/services/TranscriptionService";

export class TranscribeAudio {
  constructor(private transcriptionService: TranscriptionService) {}

  async execute(audioBlob: Blob, duration: number = 0): Promise<string> {
    const recording = new AudioRecording(
      Date.now().toString(),
      audioBlob,
      duration
    );

    return await this.transcriptionService.transcribeRecording(recording);
  }
}
