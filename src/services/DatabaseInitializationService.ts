import { DrizzleMigrationAdapter } from "@/adapters/DrizzleMigrationAdapter";
import { DrizzleSeederAdapter } from "@/adapters/DrizzleSeederAdapter";
import { MigrationPort } from "@/ports/MigrationPort";
import { SeederPort } from "@/ports/SeederPort";

/**
 * Database Initialization Service
 *
 * Orchestrates database migrations and seeding using ports and adapters
 * following hexagonal architecture principles.
 */
export class DatabaseInitializationService {
  private readonly migrationAdapter: MigrationPort;
  private readonly seederAdapter: SeederPort;
  private static instance: DatabaseInitializationService | null = null;
  private initialized = false;

  constructor(migrationAdapter?: MigrationPort, seederAdapter?: SeederPort) {
    this.migrationAdapter = migrationAdapter || new DrizzleMigrationAdapter();
    this.seederAdapter = seederAdapter || new DrizzleSeederAdapter();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): DatabaseInitializationService {
    if (!DatabaseInitializationService.instance) {
      DatabaseInitializationService.instance =
        new DatabaseInitializationService();
    }
    return DatabaseInitializationService.instance;
  }

  /**
   * Initialize database with migrations and optional seeding
   */
  async initialize(
    options: {
      runMigrations?: boolean;
      runSeeders?: boolean;
      force?: boolean;
    } = {}
  ): Promise<void> {
    const { runMigrations = true, runSeeders = false, force = false } = options;

    // Prevent multiple initializations unless forced
    if (this.initialized && !force) {
      console.log("ℹ️ Database already initialized, skipping...");
      return;
    }

    try {
      console.log("🚀 Initializing database...");

      // Run migrations if enabled
      if (runMigrations) {
        const migrationRequired =
          await this.migrationAdapter.isMigrationRequired();
        if (migrationRequired || force) {
          await this.migrationAdapter.runMigrations();
        } else {
          console.log("ℹ️ Database schema is up to date");
        }
      }

      // Run seeders if enabled
      if (runSeeders) {
        const seedingRequired = await this.seederAdapter.isSeedingRequired();
        if (seedingRequired || force) {
          await this.seederAdapter.runSeeders();
        } else {
          console.log("ℹ️ Database already contains data, skipping seeding");
        }
      }

      this.initialized = true;
      console.log("✅ Database initialization completed successfully");
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      throw error;
    }
  }

  /**
   * Check database health and connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const status = await this.migrationAdapter.getMigrationStatus();
      return status.isUpToDate;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }

  /**
   * Get migration status for diagnostics
   */
  async getMigrationStatus() {
    return this.migrationAdapter.getMigrationStatus();
  }

  /**
   * Force re-initialization
   */
  async reinitialize(
    options: {
      runMigrations?: boolean;
      runSeeders?: boolean;
    } = {}
  ): Promise<void> {
    this.initialized = false;
    await this.initialize({ ...options, force: true });
  }

  /**
   * Reset initialization state (useful for testing)
   */
  reset(): void {
    this.initialized = false;
    DatabaseInitializationService.instance = null;
  }
}
