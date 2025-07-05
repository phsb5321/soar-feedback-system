import { AudioTranscriptionPort } from '@/ports/AudioFeedbackPorts';

/**
 * Adapter for Groq transcription service
 * Implements AudioTranscriptionPort using Groq API
 */
export class GroqTranscriptionAdapter implements AudioTranscriptionPort {
  private readonly transcribeEndpoint: string;

  constructor(transcribeEndpoint: string = '/api/transcribe') {
    this.transcribeEndpoint = transcribeEndpoint;
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');

      const response = await fetch(this.transcribeEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.text) {
        throw new Error('No transcription text received from service');
      }

      return data.text;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Transcription error: ${error.message}`);
      }
      throw new Error('Unknown transcription error occurred');
    }
  }
}
