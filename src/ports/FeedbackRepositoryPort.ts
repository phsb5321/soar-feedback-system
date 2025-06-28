// Example port interface for feedback repository
export interface FeedbackRepositoryPort {
  saveFeedback(feedback: {
    message: string;
    type: "suggestion" | "complaint";
    anonymous?: boolean;
  }): Promise<void>;
  getFeedbackList(): Promise<
    Array<{ id: string; message: string; type: string; anonymous: boolean }>
  >;
}
