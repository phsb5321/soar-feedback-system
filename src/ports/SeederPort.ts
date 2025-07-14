/**
 * Database Seeder Port Interface
 *
 * Defines the contract for database seeding operations
 * following hexagonal architecture principles.
 */
export interface SeederPort {
  /**
   * Run all available seeders
   * @returns Promise<void>
   */
  runSeeders(): Promise<void>;

  /**
   * Run a specific seeder
   * @param seederName - Name of the seeder to run
   * @returns Promise<SeederResult>
   */
  runSeeder(seederName: string): Promise<SeederResult>;

  /**
   * Check if seeding is required (database is empty)
   * @returns Promise<boolean>
   */
  isSeedingRequired(): Promise<boolean>;

  /**
   * Get available seeders
   * @returns Promise<string[]>
   */
  getAvailableSeeders(): Promise<string[]>;

  /**
   * Clear all seeded data
   * @returns Promise<void>
   */
  clearSeededData(): Promise<void>;
}

export interface SeederResult {
  seederName: string;
  recordsCreated: number;
  success: boolean;
  error?: string;
}

export interface SeederError extends Error {
  seederName: string;
  code: string;
  details?: Record<string, unknown>;
}
