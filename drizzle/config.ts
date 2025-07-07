import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, PoolConfig } from "pg";
import * as schema from "./schema";

// Validate that DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const connectionString = process.env.DATABASE_URL;

// Parse the connection string to handle SSL settings
const urlObj = new URL(connectionString);
const sslMode = urlObj.searchParams.get("sslmode");

// Create pool configuration
const poolConfig: PoolConfig = {
  connectionString,
  max: 10, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

// Handle SSL configuration based on the sslmode parameter
if (sslMode === "require") {
  poolConfig.ssl = {
    rejectUnauthorized: false, // Allow self-signed certificates
  };
} else if (sslMode === "disable") {
  poolConfig.ssl = false;
} else if (sslMode === "prefer") {
  // Try SSL first, fallback to non-SSL if it fails
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

// Create a connection pool for better performance
const pool = new Pool(poolConfig);

// Add error handling for SSL connection issues
pool.on("error", (err) => {
  console.error("Database pool error:", err);

  // If it's an SSL error, provide helpful guidance
  if (err.message.includes("SSL") || err.message.includes("ssl")) {
    console.error(
      "SSL connection failed. Consider using sslmode=disable or sslmode=prefer in your DATABASE_URL"
    );
  }
});

// Database instance with connection pool
export const db = drizzle(pool, { schema });

// Legacy function for backward compatibility
export async function getDb() {
  return db;
}

// Function to test database connectivity with retry logic
export async function testConnection(
  retries = 3,
  delay = 1000
): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      await client.query("SELECT 1");
      client.release();
      return true;
    } catch (error) {
      console.error(
        `Database connection attempt ${attempt}/${retries} failed:`,
        error
      );

      if (attempt < retries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  return false;
}

// Function to initialize and validate database connection
export async function initializeDatabase(): Promise<void> {
  console.log("🔄 Initializing database connection...");

  const isConnected = await testConnection();
  if (!isConnected) {
    throw new Error(
      "Failed to establish database connection after multiple attempts"
    );
  }

  console.log("✅ Database connection initialized successfully");
}

// Function to check if database is ready
export async function isDatabaseReady(): Promise<boolean> {
  try {
    const client = await pool.connect();

    // Check if feedback table exists
    const tableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
      ) as exists
    `);

    client.release();
    return tableResult.rows?.[0]?.exists || false;
  } catch (error) {
    console.error("Database readiness check failed:", error);
    return false;
  }
}

// Function to gracefully close all connections
export async function closeConnections() {
  await pool.end();
}
