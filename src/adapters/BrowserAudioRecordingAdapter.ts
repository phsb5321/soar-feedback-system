import { AudioRecordingPort } from "@/ports/AudioFeedbackPorts";

/**
 * Adapter for browser audio recording
 * Implements AudioRecordingPort using Web Audio API
 */
export class BrowserAudioRecordingAdapter implements AudioRecordingPort {
  private mediaStream: MediaStream | null = null;

  async startRecording(): Promise<MediaRecorder> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(this.mediaStream);
      return mediaRecorder;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Recording start error: ${error.message}`);
      }
      throw new Error("Unknown recording start error occurred");
    }
  }

  async stopRecording(recorder: MediaRecorder): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: "audio/webm" });

          // Clean up media stream
          if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = null;
          }

          resolve(blob);
        } catch (error) {
          reject(
            error instanceof Error
              ? error
              : new Error("Unknown recording stop error")
          );
        }
      };

      recorder.onerror = (event) => {
        reject(
          new Error(
            `Recording error: ${event.error?.message || "Unknown error"}`
          )
        );
      };

      try {
        recorder.stop();
      } catch (error) {
        reject(
          error instanceof Error ? error : new Error("Failed to stop recording")
        );
      }
    });
  }
}
