// Port for audio transcription
export interface TranscriptionPort {
  transcribeAudio(filePath: string): Promise<string>;
  transcribeAudioBlob?(audioBlob: Blob): Promise<string>;
}
