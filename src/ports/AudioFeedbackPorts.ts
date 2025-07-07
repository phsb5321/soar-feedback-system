/**
 * Port for audio transcription services
 * Defines the contract for transcribing audio to text
 */
export interface AudioTranscriptionPort {
  /**
   * Transcribe audio blob to text
   * @param audioBlob - The audio data to transcribe
   * @returns Promise resolving to the transcribed text
   */
  transcribeAudio(audioBlob: Blob): Promise<string>;
}

/**
 * Port for feedback submission services
 * Defines the contract for submitting feedback data
 */
export interface FeedbackSubmissionPort {
  /**
   * Submit feedback data
   * @param feedbackData - The feedback data to submit
   * @returns Promise resolving when submission is complete
   */
  submitFeedback(feedbackData: {
    audioBlob: Blob;
    transcription: string;
    npsScore?: number;
    additionalComment?: string;
  }): Promise<void>;
}

/**
 * Port for audio recording services
 * Defines the contract for recording audio
 */
export interface AudioRecordingPort {
  /**
   * Start recording audio
   * @returns Promise resolving to MediaRecorder instance
   */
  startRecording(): Promise<MediaRecorder>;

  /**
   * Stop recording audio
   * @param recorder - The MediaRecorder instance
   * @returns Promise resolving to the recorded audio blob
   */
  stopRecording(recorder: MediaRecorder): Promise<Blob>;
}
