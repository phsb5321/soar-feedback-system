import { BrowserAudioRecordingAdapter } from "@/adapters/BrowserAudioRecordingAdapter";
import { GroqTranscriptionAdapter } from "@/adapters/GroqTranscriptionAdapter";
import { RestFeedbackSubmissionAdapter } from "@/adapters/RestFeedbackSubmissionAdapter";
import { SubmitAudioFeedbackUseCase } from "@/application/SubmitAudioFeedbackUseCase";
import { TranscribeAudioUseCase } from "@/application/TranscribeAudioUseCase";
import { AudioRecordingPort } from "@/ports/AudioFeedbackPorts";

/**
 * Service layer for audio feedback functionality
 * Provides high-level interface for UI components
 * Follows Dependency Inversion Principle
 */
export class AudioFeedbackService {
  private readonly transcribeAudioUseCase: TranscribeAudioUseCase;
  private readonly submitAudioFeedbackUseCase: SubmitAudioFeedbackUseCase;
  private readonly audioRecordingAdapter: AudioRecordingPort;

  constructor() {
    // Initialize adapters
    const transcriptionAdapter = new GroqTranscriptionAdapter();
    const feedbackSubmissionAdapter = new RestFeedbackSubmissionAdapter();
    this.audioRecordingAdapter = new BrowserAudioRecordingAdapter();

    // Initialize use cases
    this.transcribeAudioUseCase = new TranscribeAudioUseCase(
      transcriptionAdapter
    );
    this.submitAudioFeedbackUseCase = new SubmitAudioFeedbackUseCase(
      transcriptionAdapter,
      feedbackSubmissionAdapter
    );
  }

  /**
   * Start recording audio
   * @returns Promise resolving to MediaRecorder instance
   */
  async startRecording(): Promise<MediaRecorder> {
    return this.audioRecordingAdapter.startRecording();
  }

  /**
   * Stop recording audio
   * @param recorder - The MediaRecorder instance
   * @returns Promise resolving to the recorded audio blob
   */
  async stopRecording(recorder: MediaRecorder): Promise<Blob> {
    return this.audioRecordingAdapter.stopRecording(recorder);
  }

  /**
   * Transcribe audio to text
   * @param audioBlob - The audio data to transcribe
   * @returns Promise resolving to the transcribed text
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    return this.transcribeAudioUseCase.execute(audioBlob);
  }

  /**
   * Submit audio feedback
   * @param audioBlob - The recorded audio
   * @param npsScore - Optional NPS score
   * @param additionalComment - Optional additional comment
   * @returns Promise resolving when submission is complete
   */
  async submitAudioFeedback(
    audioBlob: Blob,
    npsScore?: number,
    additionalComment?: string
  ): Promise<void> {
    await this.submitAudioFeedbackUseCase.execute(
      audioBlob,
      npsScore,
      additionalComment
    );
  }
}
