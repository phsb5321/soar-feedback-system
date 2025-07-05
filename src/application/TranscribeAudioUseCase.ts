import { AudioTranscriptionPort } from '@/ports/AudioFeedbackPorts';

/**
 * Use case for transcribing audio
 * Follows Single Responsibility Principle
 */
export class TranscribeAudioUseCase {
  constructor(private readonly transcriptionPort: AudioTranscriptionPort) {}

  /**
   * Execute audio transcription
   * @param audioBlob - The audio data to transcribe
   * @returns Promise resolving to the transcribed text
   */
  async execute(audioBlob: Blob): Promise<string> {
    try {
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Audio blob is required and cannot be empty');
      }

      const transcription = await this.transcriptionPort.transcribeAudio(audioBlob);
      
      if (!transcription || transcription.trim().length === 0) {
        throw new Error('Transcription result is empty');
      }

      return transcription.trim();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Audio transcription failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred during audio transcription');
    }
  }
}
