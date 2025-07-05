import { getDb } from './config';
import { feedback } from './schema';

async function migrate() {
  const db = await getDb();
  // This is a placeholder for Drizzle's migration logic
  // In real projects, use drizzle-kit or a migration tool
  // Here, we just ensure the table exists (for demo)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      audio_url TEXT NOT NULL,
      transcription TEXT NOT NULL,
      csat INTEGER,
      additional_comment TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
  console.log('Migration complete.');
  process.exit(0);
}

migrate();
