import { migrate } from "drizzle-orm/postgres-js/migrator";
import { getDb } from "../../drizzle/config";
import {
  MigrationPort,
  MigrationStatus,
  MigrationError,
} from "@/ports/MigrationPort";
import { sql } from "drizzle-orm";
import path from "path";
import fs from "fs";

/**
 * Drizzle ORM Migration Adapter
 * 
 * Implements MigrationPort using Drizzle ORM for PostgreSQL
 * following hexagonal architecture principles.
 */
export class DrizzleMigrationAdapter implements MigrationPort {
  private readonly migrationsFolder: string;

  constructor(migrationsFolder: string = "drizzle/migrations") {
    this.migrationsFolder = path.resolve(process.cwd(), migrationsFolder);
  }

  /**
   * Run all pending migrations
   */
  async runMigrations(): Promise<void> {
    try {
      console.log("🔄 Running database migrations...");
      
      const db = await getDb();
      
      // Ensure migrations folder exists
      if (!fs.existsSync(this.migrationsFolder)) {
        console.log("⚠️ No migrations folder found, creating database schema...");
        await this.createSchema();
        return;
      }

      // Run migrations using Drizzle
      await migrate(db, { migrationsFolder: this.migrationsFolder });
      
      console.log("✅ Database migrations completed successfully");
    } catch (error) {
      const migrationError: MigrationError = {
        name: "MigrationError",
        message: `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
        code: "MIGRATION_FAILED",
        details: { originalError: error },
      };
      throw migrationError;
    }
  }

  /**
   * Check if migration is required
   */
  async isMigrationRequired(): Promise<boolean> {
    try {
      const status = await this.getMigrationStatus();
      return !status.isUpToDate || status.pending.length > 0;
    } catch {
      // If we can't check status, assume migration is required
      console.warn("⚠️ Could not check migration status, assuming migration required");
      return true;
    }
  }

  /**
   * Get current migration status
   */
  async getMigrationStatus(): Promise<MigrationStatus> {
    try {
      const db = await getDb();
      
      // Check if __drizzle_migrations table exists
      const migrationsTableExists = await this.checkMigrationsTableExists();
      
      if (!migrationsTableExists) {
        return {
          current: null,
          pending: await this.getAvailableMigrations(),
          applied: [],
          isUpToDate: false,
        };
      }

      // Get applied migrations from database
      const appliedMigrations: string[] = await db
        .execute(sql`SELECT id FROM __drizzle_migrations ORDER BY created_at`)
        .then(result => result.rows.map(row => String(row.id)))
        .catch(() => []);

      // Get available migrations from filesystem
      const availableMigrations: string[] = await this.getAvailableMigrations();
      
      // Calculate pending migrations
      const pending = availableMigrations.filter(
        migration => !appliedMigrations.includes(migration)
      );

      const current = appliedMigrations.length > 0 
        ? appliedMigrations[appliedMigrations.length - 1] 
        : null;

      return {
        current,
        pending,
        applied: appliedMigrations,
        isUpToDate: pending.length === 0,
      };
    } catch (error) {
      throw new Error(`Failed to get migration status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Rollback migration (placeholder - Drizzle doesn't support rollbacks by default)
   */
  async rollbackMigration(): Promise<void> {
    throw new Error("Migration rollback not supported in this implementation. Consider using database backups instead.");
  }

  /**
   * Create database schema directly (for environments without migration files)
   */
  private async createSchema(): Promise<void> {
    try {
      const db = await getDb();
      
      // Create feedback table directly
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS feedback (
          id SERIAL PRIMARY KEY,
          audio_url TEXT NOT NULL,
          transcription TEXT NOT NULL,
          csat INTEGER,
          additional_comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        )
      `);

      console.log("✅ Database schema created successfully");
    } catch (error) {
      throw new Error(`Failed to create schema: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if migrations table exists
   */
  private async checkMigrationsTableExists(): Promise<boolean> {
    try {
      const db = await getDb();
      const result = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = '__drizzle_migrations'
        )
      `);
      return result.rows[0]?.exists === true;
    } catch {
      return false;
    }
  }

  /**
   * Get available migration files
   */
  private async getAvailableMigrations(): Promise<string[]> {
    try {
      if (!fs.existsSync(this.migrationsFolder)) {
        return [];
      }

      const files = fs.readdirSync(this.migrationsFolder);
      return files
        .filter(file => file.endsWith('.sql'))
        .map(file => path.basename(file, '.sql'))
        .sort();
    } catch {
      return [];
    }
  }
}
