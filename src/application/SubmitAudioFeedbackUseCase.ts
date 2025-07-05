import { AudioFeedback } from '@/domain/AudioFeedback';
import { AudioTranscriptionPort, FeedbackSubmissionPort } from '@/ports/AudioFeedbackPorts';

/**
 * Use case for submitting audio feedback
 * Follows Single Responsibility Principle
 */
export class SubmitAudioFeedbackUseCase {
  constructor(
    private readonly transcriptionPort: AudioTranscriptionPort,
    private readonly feedbackSubmissionPort: FeedbackSubmissionPort
  ) {}

  /**
   * Execute the audio feedback submission process
   * @param audioBlob - The recorded audio
   * @param npsScore - Optional NPS score
   * @param additionalComment - Optional additional comment
   * @returns Promise resolving to the created AudioFeedback entity
   */
  async execute(
    audioBlob: Blob,
    npsScore?: number,
    additionalComment?: string
  ): Promise<AudioFeedback> {
    try {
      // First transcribe the audio
      const transcription = await this.transcriptionPort.transcribeAudio(audioBlob);
      
      // Create domain entity
      const audioFeedback = new AudioFeedback(
        this.generateId(),
        audioBlob,
        transcription,
        npsScore,
        additionalComment
      );

      // Submit the feedback
      await this.feedbackSubmissionPort.submitFeedback({
        audioBlob: audioFeedback.audioBlob,
        transcription: audioFeedback.transcription,
        npsScore: audioFeedback.npsScore,
        additionalComment: audioFeedback.additionalComment,
      });

      return audioFeedback;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Audio feedback submission failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred during audio feedback submission');
    }
  }

  private generateId(): string {
    return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
