/**
 * Migration Port Interface
 * 
 * Defines the contract for database migration operations
 * following hexagonal architecture principles.
 */
export interface MigrationPort {
  /**
   * Run all pending migrations
   * @returns Promise<void>
   */
  runMigrations(): Promise<void>;

  /**
   * Check if database schema is up to date
   * @returns Promise<boolean>
   */
  isMigrationRequired(): Promise<boolean>;

  /**
   * Get current migration status
   * @returns Promise<MigrationStatus>
   */
  getMigrationStatus(): Promise<MigrationStatus>;

  /**
   * Rollback to a specific migration
   * @param target - Target migration to rollback to
   * @returns Promise<void>
   */
  rollbackMigration(target?: string): Promise<void>;
}

export interface MigrationStatus {
  current: string | null;
  pending: string[];
  applied: string[];
  isUpToDate: boolean;
}

export interface MigrationError extends Error {
  code: string;
  details?: Record<string, unknown>;
}
