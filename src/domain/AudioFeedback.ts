/**
 * Domain Entity: AudioFeedback
 * Represents the core business entity for audio feedback
 */
export class AudioFeedback {
  constructor(
    public readonly id: string,
    public readonly audioBlob: Blob,
    public readonly transcription: string,
    public readonly npsScore?: number,
    public readonly additionalComment?: string,
    public readonly timestamp: Date = new Date()
  ) {
    // Validate required fields
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error('Audio blob is required and cannot be empty');
    }
    
    if (!transcription || transcription.trim().length === 0) {
      throw new Error('Transcription is required and cannot be empty');
    }
    
    // Validate NPS score range
    if (npsScore !== undefined && (npsScore < 0 || npsScore > 10)) {
      throw new Error('NPS score must be between 0 and 10');
    }
  }

  /**
   * Check if feedback has NPS score
   */
  hasNpsScore(): boolean {
    return this.npsScore !== undefined;
  }

  /**
   * Check if feedback has additional comment
   */
  hasAdditionalComment(): boolean {
    return this.additionalComment !== undefined && this.additionalComment.trim().length > 0;
  }

  /**
   * Get NPS category based on score
   */
  getNpsCategory(): 'detractor' | 'passive' | 'promoter' | 'none' {
    if (this.npsScore === undefined) return 'none';
    
    if (this.npsScore <= 6) return 'detractor';
    if (this.npsScore <= 8) return 'passive';
    return 'promoter';
  }
}
