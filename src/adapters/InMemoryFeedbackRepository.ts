// Example adapter for FeedbackRepositoryPort (in-memory)
import { FeedbackRepositoryPort } from "../ports/FeedbackRepositoryPort";

const feedbacks: Array<{
  id: string;
  message: string;
  type: string;
  anonymous: boolean;
}> = [];

export class InMemoryFeedbackRepository implements FeedbackRepositoryPort {
  async saveFeedback(feedback: {
    message: string;
    type: "suggestion" | "complaint";
    anonymous?: boolean;
  }): Promise<void> {
    feedbacks.push({
      id: (feedbacks.length + 1).toString(),
      message: feedback.message,
      type: feedback.type,
      anonymous: feedback.anonymous ?? false,
    });
  }

  async getFeedbackList() {
    return feedbacks;
  }
}
