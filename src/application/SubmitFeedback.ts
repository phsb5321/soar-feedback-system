// Application Use Case: SubmitFeedback
import { Feedback } from "@/domain/Feedback";
import { FeedbackRepositoryPort } from "@/ports/FeedbackRepositoryPort";

export class SubmitFeedback {
  constructor(private feedbackRepo: FeedbackRepositoryPort) {}

  async execute(
    message: string,
    type: "suggestion" | "complaint",
    anonymous = false
  ) {
    const feedback = new Feedback(
      Date.now().toString(),
      message,
      type,
      anonymous
    );
    await this.feedbackRepo.saveFeedback(feedback);
    return feedback;
  }
}
