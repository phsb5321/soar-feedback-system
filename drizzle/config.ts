import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Function to construct DATABASE_URL from individual components if not provided
function getDatabaseUrl(): string {
  // If DATABASE_URL is provided, use it directly
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Otherwise, construct it from individual environment variables
  const {
    POSTGRES_USER = "postgres",
    POSTGRES_PASSWORD = "postgres",
    POSTGRES_HOST = "localhost",
    POSTGRES_PORT = "5432",
    POSTGRES_DB = "soar_feedback",
  } = process.env;

  return `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
}

// Get the connection string
const connectionString = getDatabaseUrl();

// Validate that we have a valid connection string
if (!connectionString) {
  throw new Error(
    "DATABASE_URL or PostgreSQL environment variables are required"
  );
}

// Create a connection pool for better performance
const pool = new Pool({
  connectionString,
  max: 10, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Database instance with connection pool
export const db = drizzle(pool, { schema });

// Legacy function for backward compatibility
export async function getDb() {
  return db;
}

// Function to test database connectivity
export async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

// Function to gracefully close all connections
export async function closeConnections() {
  await pool.end();
}
