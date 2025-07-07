const { Client } = require("pg");

async function testConnection() {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/soar_feedback";

  console.log("Testing database connection...");
  console.log(
    "Connection string:",
    connectionString.replace(/:[^:@]*@/, ":****@")
  );

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("✅ Database connection successful!");

    // Test if feedback table exists
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'feedback'
    `);

    if (result.rows.length > 0) {
      console.log("✅ Feedback table exists!");

      // Test inserting a sample record
      const insertResult = await client.query(
        `
        INSERT INTO feedback (audio_url, transcription, csat, additional_comment)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at
      `,
        ["test-audio.webm", "This is a test transcription", 8, "Test comment"]
      );

      console.log("✅ Sample record inserted:", insertResult.rows[0]);

      // Count total records
      const countResult = await client.query("SELECT COUNT(*) FROM feedback");
      console.log("📊 Total feedback records:", countResult.rows[0].count);
    } else {
      console.log("❌ Feedback table does not exist!");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  } finally {
    await client.end();
  }
}

testConnection();
