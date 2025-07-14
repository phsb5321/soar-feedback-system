import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, testConnection } from "../../../../drizzle/config";
import { feedback } from "../../../../drizzle/schema";
import { ensureDbReady } from "../../../lib/db-init";

export async function GET() {
  try {
    const startTime = Date.now();

    // Ensure database is initialized and ready
    await ensureDbReady();

    // Test basic connectivity
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        {
          status: "unhealthy",
          error: "Database connection failed",
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Test database operations
    const dbVersionResult = await db.execute(sql`SELECT version()`);
    const tableExistsResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'feedback'
      ) as exists
    `);

    const feedbackCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(feedback);

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      database: {
        connected: true,
        version:
          dbVersionResult.rows?.[0]?.version?.toString().split(" ")[0] ||
          "unknown",
        tableExists: tableExistsResult.rows?.[0]?.exists || false,
        feedbackCount: feedbackCount[0]?.count || 0,
        responseTimeMs: responseTime,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? "configured" : "missing",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
