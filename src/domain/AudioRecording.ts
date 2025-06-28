// Domain Entity: AudioRecording
export class AudioRecording {
  constructor(
    public readonly id: string,
    public readonly blob: Blob,
    public readonly duration: number,
    public readonly timestamp: Date = new Date()
  ) {}

  get sizeInBytes(): number {
    return this.blob.size;
  }

  get mimeType(): string {
    return this.blob.type;
  }

  isValid(): boolean {
    return this.blob.size > 0 && this.duration > 0;
  }
}
