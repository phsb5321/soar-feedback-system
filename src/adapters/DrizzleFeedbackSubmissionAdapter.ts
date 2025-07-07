import { FeedbackSubmissionPort } from "@/ports/AudioFeedbackPorts";
import { getDb } from "../../drizzle/config";
import { feedback } from "../../drizzle/schema";

/**
 * Database adapter for feedback submission using Drizzle ORM
 * Implements FeedbackSubmissionPort following hexagonal architecture
 */
export class DrizzleFeedbackSubmissionAdapter
  implements FeedbackSubmissionPort
{
  async submitFeedback(feedbackData: {
    audioBlob: Blob;
    transcription: string;
    npsScore?: number;
    additionalComment?: string;
  }): Promise<void> {
    try {
      const db = await getDb();

      // For now, we'll store a placeholder for audio_url since we're not implementing file storage
      // In a real application, you would upload the audio blob to cloud storage and store the URL
      const audioUrl = `audio_${Date.now()}.webm`; // Placeholder

      await db.insert(feedback).values({
        audio_url: audioUrl,
        transcription: feedbackData.transcription,
        csat: feedbackData.npsScore,
        additional_comment: feedbackData.additionalComment,
      });

      console.log("Feedback saved to database successfully");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Database feedback submission error: ${error.message}`);
      }
      throw new Error(
        "Unknown database error occurred during feedback submission"
      );
    }
  }
}
