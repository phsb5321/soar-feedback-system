#!/usr/bin/env tsx

/**
 * Database SSL Connection Troubleshooter
 * 
 * This script helps diagnose and fix SSL connection issues with PostgreSQL databases.
 * It tests different SSL configurations to find the one that works for your environment.
 */

import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

console.log("🔍 Testing PostgreSQL SSL Connection Configurations");
console.log("=".repeat(50));

async function testConnectionWithConfig(sslConfig: boolean | object, description: string): Promise<boolean> {
  console.log(`\n🧪 Testing: ${description}`);
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: sslConfig,
    max: 1,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    await pool.end();
    console.log("✅ SUCCESS: Connection established");
    return true;
  } catch (error: unknown) {
    const err = error as Error & { code?: string };
    console.log("❌ FAILED:", err.message);
    if (err.code) {
      console.log("   Error Code:", err.code);
    }
    await pool.end();
    return false;
  }
}

async function main() {
  const originalUrl = new URL(DATABASE_URL);
  console.log(`Database Host: ${originalUrl.hostname}`);
  console.log(`Database Port: ${originalUrl.port || 5432}`);
  console.log(`SSL Mode: ${originalUrl.searchParams.get('sslmode') || 'not specified'}`);

  const configurations = [
    {
      config: false,
      description: "No SSL (sslmode=disable)",
      suggestedUrl: DATABASE_URL.replace(/[?&]sslmode=[^&]*/g, '') + (DATABASE_URL.includes('?') ? '&' : '?') + 'sslmode=disable'
    },
    {
      config: { rejectUnauthorized: false },
      description: "SSL with self-signed certificates allowed",
      suggestedUrl: DATABASE_URL.replace(/sslmode=[^&]*/g, 'sslmode=require')
    },
    {
      config: { 
        rejectUnauthorized: false, 
        checkServerIdentity: () => undefined,
        secureProtocol: 'TLSv1_2_method'
      },
      description: "SSL with all certificate checks disabled",
      suggestedUrl: DATABASE_URL.replace(/sslmode=[^&]*/g, 'sslmode=require')
    },
    {
      config: true,
      description: "SSL with full certificate verification",
      suggestedUrl: DATABASE_URL.replace(/sslmode=[^&]*/g, 'sslmode=require')
    }
  ];

  let successFound = false;

  for (const { config, description, suggestedUrl } of configurations) {
    const success = await testConnectionWithConfig(config, description);
    
    if (success && !successFound) {
      successFound = true;
      console.log("\n🎉 RECOMMENDED SOLUTION:");
      console.log("Update your DATABASE_URL to:");
      console.log(suggestedUrl);
      console.log("\nOr set this environment variable:");
      console.log(`DATABASE_URL="${suggestedUrl}"`);
    }
  }

  if (!successFound) {
    console.log("\n❌ No working SSL configuration found.");
    console.log("\n🔧 TROUBLESHOOTING STEPS:");
    console.log("1. Check if your PostgreSQL server is running");
    console.log("2. Verify the hostname and port are correct");
    console.log("3. Ensure your database server allows connections from this IP");
    console.log("4. Check firewall settings");
    console.log("5. Verify database credentials");
  }

  console.log("\n" + "=".repeat(50));
  console.log("Troubleshooting complete.");
}

main().catch(console.error);
