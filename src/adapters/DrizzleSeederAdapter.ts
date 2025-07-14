import { SeederError, SeederPort, SeederResult } from "@/ports/SeederPort";
import { sql } from "drizzle-orm";
import { getDb } from "../../drizzle/config";
import { feedback } from "../../drizzle/schema";

/**
 * Drizzle ORM Seeder Adapter
 *
 * Implements SeederPort using Drizzle ORM for PostgreSQL
 * following hexagonal architecture principles.
 */
export class DrizzleSeederAdapter implements SeederPort {
  private readonly seeders: Record<string, () => Promise<SeederResult>>;

  constructor() {
    this.seeders = {
      sampleFeedback: this.seedSampleFeedback.bind(this),
    };
  }

  /**
   * Run all available seeders
   */
  async runSeeders(): Promise<void> {
    try {
      console.log("🌱 Running database seeders...");

      const isRequired = await this.isSeedingRequired();
      if (!isRequired) {
        console.log("ℹ️ Database already contains data, skipping seeding");
        return;
      }

      const seederNames = await this.getAvailableSeeders();
      const results: SeederResult[] = [];

      for (const seederName of seederNames) {
        try {
          const result = await this.runSeeder(seederName);
          results.push(result);
          console.log(
            `✅ Seeder '${seederName}' completed: ${result.recordsCreated} records created`
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(`❌ Seeder '${seederName}' failed: ${errorMessage}`);
          results.push({
            seederName,
            recordsCreated: 0,
            success: false,
            error: errorMessage,
          });
        }
      }

      const successful = results.filter((r) => r.success).length;
      const total = results.length;
      console.log(
        `🌱 Seeding completed: ${successful}/${total} seeders successful`
      );
    } catch (error) {
      throw new Error(
        `Seeding failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Run a specific seeder
   */
  async runSeeder(seederName: string): Promise<SeederResult> {
    try {
      const seederFn = this.seeders[seederName];
      if (!seederFn) {
        throw new Error(`Seeder '${seederName}' not found`);
      }

      return await seederFn();
    } catch (error) {
      const seederError: SeederError = {
        name: "SeederError",
        message: `Seeder '${seederName}' failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        seederName,
        code: "SEEDER_FAILED",
        details: { originalError: error },
      };
      throw seederError;
    }
  }

  /**
   * Check if seeding is required (database is empty)
   */
  async isSeedingRequired(): Promise<boolean> {
    try {
      const db = await getDb();

      // Check if feedback table has any data
      const result = await db
        .execute(sql`SELECT COUNT(*) as count FROM feedback LIMIT 1`)
        .catch(() => ({ rows: [{ count: "0" }] }));

      const count = parseInt((result.rows[0]?.count as string) || "0");
      return count === 0;
    } catch {
      // If we can't check, assume seeding is not required to be safe
      return false;
    }
  }

  /**
   * Get available seeders
   */
  async getAvailableSeeders(): Promise<string[]> {
    return Object.keys(this.seeders);
  }

  /**
   * Clear all seeded data
   */
  async clearSeededData(): Promise<void> {
    try {
      console.log("🧹 Clearing seeded data...");
      const db = await getDb();

      // Clear feedback table
      await db.execute(sql`DELETE FROM feedback`);

      console.log("✅ Seeded data cleared successfully");
    } catch (error) {
      throw new Error(
        `Failed to clear seeded data: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Seed sample feedback data
   */
  private async seedSampleFeedback(): Promise<SeederResult> {
    try {
      const db = await getDb();

      const sampleData = [
        {
          audio_url: "sample_audio_1.webm",
          transcription:
            "This is a great application! I love the voice feedback feature. It makes providing feedback so much easier and more natural.",
          csat: 9,
          additional_comment:
            "Keep up the excellent work! The user interface is intuitive and the voice recognition is very accurate.",
        },
        {
          audio_url: "sample_audio_2.webm",
          transcription:
            "The application works well overall, but I think the loading times could be improved. Sometimes it takes a while to process the audio.",
          csat: 7,
          additional_comment:
            "Consider optimizing the audio processing pipeline for better performance.",
        },
        {
          audio_url: "sample_audio_3.webm",
          transcription:
            "I encountered a bug where the audio recording stopped suddenly. Also, it would be nice to have a dark mode option.",
          csat: 5,
          additional_comment:
            "Bug report: Audio recording interruption on Chrome browser. Feature request: Dark mode theme.",
        },
        {
          audio_url: "sample_audio_4.webm",
          transcription:
            "Excellent tool for collecting user feedback! The SOAR methodology integration is brilliant. This will definitely help our team improve our services.",
          csat: 10,
          additional_comment:
            "Perfect implementation of the SOAR framework. Very professional and well-designed.",
        },
        {
          audio_url: "sample_audio_5.webm",
          transcription:
            "The application is okay but needs more features. Maybe add the ability to edit transcriptions or support for multiple languages.",
          csat: 6,
          additional_comment:
            "Feature suggestions: Transcription editing, multi-language support, export functionality.",
        },
      ];

      const insertedRecords = await db
        .insert(feedback)
        .values(sampleData)
        .returning();

      return {
        seederName: "sampleFeedback",
        recordsCreated: insertedRecords.length,
        success: true,
      };
    } catch (error) {
      throw new Error(
        `Failed to seed sample feedback: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
