import { FeedbackSubmissionPort } from '@/ports/AudioFeedbackPorts';

/**
 * Adapter for feedback submission service
 * Implements FeedbackSubmissionPort using REST API
 */
export class RestFeedbackSubmissionAdapter implements FeedbackSubmissionPort {
  private readonly submitEndpoint: string;

  constructor(submitEndpoint: string = '/api/feedback') {
    this.submitEndpoint = submitEndpoint;
  }

  async submitFeedback(feedbackData: {
    audioBlob: Blob;
    transcription: string;
    npsScore?: number;
    additionalComment?: string;
  }): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('audio', feedbackData.audioBlob);
      formData.append('transcription', feedbackData.transcription);
      
      if (feedbackData.npsScore !== undefined) {
        formData.append('npsScore', feedbackData.npsScore.toString());
      }
      
      if (feedbackData.additionalComment !== undefined) {
        formData.append('additionalComment', feedbackData.additionalComment);
      }

      const response = await fetch(this.submitEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Feedback submission failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Feedback submission error: ${error.message}`);
      }
      throw new Error('Unknown feedback submission error occurred');
    }
  }
}
