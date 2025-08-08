import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db, testConnection } from "../../../../drizzle/config";
import { ensureDbReady } from "../../../lib/db-init";

/**
 * Analytics API endpoint for comprehensive feedback insights
 *
 * Provides AI-powered analytics and business intelligence from user feedback
 * including sentiment analysis, trending topics, priority issues, and more.
 */

interface AnalyticsResponse {
  overview: {
    totalFeedback: number;
    aiProcessedCount: number;
    averageCSAT: number;
    processingSuccessRate: number;
  };
  sentiment: {
    distribution: Record<string, number>;
    trends: Array<{
      sentiment: string;
      count: number;
      percentage: number;
    }>;
  };
  intent: {
    distribution: Record<string, number>;
    topIntents: Array<{
      intent: string;
      count: number;
      averageCSAT: number;
    }>;
  };
  priority: {
    distribution: Record<string, number>;
    criticalIssues: number;
    highPriorityIssues: number;
  };
  departments: {
    workload: Record<string, number>;
    averageUrgency: Record<string, number>;
  };
  businessIntelligence: {
    topTags: Array<{
      tag: string;
      count: number;
    }>;
    topTopics: Array<{
      topic: string;
      count: number;
    }>;
    productMentions: Array<{
      product: string;
      count: number;
      sentiment: string;
    }>;
    featureRequests: Array<{
      feature: string;
      count: number;
      priority: string;
    }>;
    bugReports: Array<{
      bug: string;
      count: number;
      urgency: number;
    }>;
  };
  customerInsights: {
    customerTypes: Record<string, number>;
    followUpRequired: number;
    averageInteractionQuality: number;
    languageDistribution: Record<string, number>;
  };
  wordCloud: Array<{
    phrase: string;
    frequency: number;
    sentiment: string;
  }>;
  timeAnalysis: {
    recentTrends: Array<{
      date: string;
      count: number;
      averageSentiment: number;
    }>;
    processingTimes: {
      averageWordCount: number;
      averageCharacterCount: number;
      readabilityScore: number;
    };
  };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Ensure database is ready
    await ensureDbReady();

    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 }
      );
    }

    const url = new URL(req.url);
    const dateFrom = url.searchParams.get("from");
    const dateTo = url.searchParams.get("to");
    const department = url.searchParams.get("department");
    const sentiment = url.searchParams.get("sentiment");

    // Build dynamic WHERE clause based on filters
    let whereClause = "WHERE 1=1";
    const params: any[] = [];

    if (dateFrom) {
      whereClause += ` AND created_at >= $${params.length + 1}`;
      params.push(dateFrom);
    }

    if (dateTo) {
      whereClause += ` AND created_at <= $${params.length + 1}`;
      params.push(dateTo);
    }

    if (department) {
      whereClause += ` AND ai_department = $${params.length + 1}`;
      params.push(department);
    }

    if (sentiment) {
      whereClause += ` AND ai_sentiment = $${params.length + 1}`;
      params.push(sentiment);
    }

    // 1. Overview Statistics
    const overviewQuery = await db.execute(sql.raw(`
      SELECT
        COUNT(*) as total_feedback,
        COUNT(CASE WHEN ai_processed = true THEN 1 END) as ai_processed_count,
        ROUND(AVG(csat), 2) as average_csat,
        ROUND(
          COUNT(CASE WHEN ai_processed = true AND ai_processing_error IS NULL THEN 1 END) * 100.0 /
          NULLIF(COUNT(CASE WHEN ai_processed = true THEN 1 END), 0),
          2
        ) as processing_success_rate
      FROM feedback ${whereClause}
    `, params));

    const overview = overviewQuery.rows[0];

    // 2. Sentiment Analysis
    const sentimentQuery = await db.execute(sql.raw(`
      SELECT
        ai_sentiment,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
      FROM feedback
      ${whereClause} AND ai_sentiment IS NOT NULL
      GROUP BY ai_sentiment
      ORDER BY count DESC
    `, params));

    // 3. Intent Analysis
    const intentQuery = await db.execute(sql.raw(`
      SELECT
        ai_intent,
        COUNT(*) as count,
        ROUND(AVG(csat), 2) as average_csat
      FROM feedback
      ${whereClause} AND ai_intent IS NOT NULL
      GROUP BY ai_intent
      ORDER BY count DESC
      LIMIT 10
    `, params));

    // 4. Priority Distribution
    const priorityQuery = await db.execute(sql.raw(`
      SELECT
        ai_priority_level,
        COUNT(*) as count
      FROM feedback
      ${whereClause} AND ai_priority_level IS NOT NULL
      GROUP BY ai_priority_level
      ORDER BY
        CASE ai_priority_level
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END
    `, params));

    // 5. Department Workload
    const departmentQuery = await db.execute(sql.raw(`
      SELECT
        ai_department,
        COUNT(*) as count,
        ROUND(AVG(ai_urgency_score), 3) as average_urgency
      FROM feedback
      ${whereClause} AND ai_department IS NOT NULL
      GROUP BY ai_department
      ORDER BY count DESC
    `, params));

    // 6. Top Tags (from JSONB array)
    const tagsQuery = await db.execute(sql.raw(`
      SELECT
        tag,
        COUNT(*) as count
      FROM feedback,
           jsonb_array_elements_text(ai_tags) as tag
      ${whereClause} AND ai_tags IS NOT NULL
      GROUP BY tag
      ORDER BY count DESC
      LIMIT 20
    `, params));

    // 7. Top Topics
    const topicsQuery = await db.execute(sql.raw(`
      SELECT
        topic,
        COUNT(*) as count
      FROM feedback,
           jsonb_array_elements_text(ai_topics) as topic
      ${whereClause} AND ai_topics IS NOT NULL
      GROUP BY topic
      ORDER BY count DESC
      LIMIT 15
    `, params));

    // 8. Product Mentions with Sentiment
    const productMentionsQuery = await db.execute(sql.raw(`
      SELECT
        product,
        COUNT(*) as count,
        MODE() WITHIN GROUP (ORDER BY ai_sentiment) as dominant_sentiment
      FROM feedback,
           jsonb_array_elements_text(ai_product_mentions) as product
      ${whereClause} AND ai_product_mentions IS NOT NULL
      GROUP BY product
      ORDER BY count DESC
      LIMIT 10
    `, params));

    // 9. Feature Requests
    const featureRequestsQuery = await db.execute(sql.raw(`
      SELECT
        feature,
        COUNT(*) as count,
        MODE() WITHIN GROUP (ORDER BY ai_priority_level) as common_priority
      FROM feedback,
           jsonb_array_elements_text(ai_feature_requests) as feature
      ${whereClause} AND ai_feature_requests IS NOT NULL
      GROUP BY feature
      ORDER BY count DESC
      LIMIT 10
    `, params));

    // 10. Bug Reports
    const bugReportsQuery = await db.execute(sql.raw(`
      SELECT
        bug,
        COUNT(*) as count,
        ROUND(AVG(ai_urgency_score), 3) as average_urgency
      FROM feedback,
           jsonb_array_elements_text(ai_bug_reports) as bug
      ${whereClause} AND ai_bug_reports IS NOT NULL
      GROUP BY bug
      ORDER BY count DESC
      LIMIT 10
    `, params));

    // 11. Customer Insights
    const customerInsightsQuery = await db.execute(sql.raw(`
      SELECT
        COUNT(CASE WHEN ai_customer_type = 'new' THEN 1 END) as new_customers,
        COUNT(CASE WHEN ai_customer_type = 'returning' THEN 1 END) as returning_customers,
        COUNT(CASE WHEN ai_customer_type = 'power_user' THEN 1 END) as power_users,
        COUNT(CASE WHEN ai_customer_type = 'enterprise' THEN 1 END) as enterprise_customers,
        COUNT(CASE WHEN ai_customer_type = 'unknown' THEN 1 END) as unknown_customers,
        COUNT(CASE WHEN ai_follow_up_required = true THEN 1 END) as follow_up_required,
        ROUND(AVG(ai_interaction_quality), 3) as average_interaction_quality
      FROM feedback
      ${whereClause}
    `, params));

    // 12. Language Distribution
    const languageQuery = await db.execute(sql.raw(`
      SELECT
        ai_language,
        COUNT(*) as count
      FROM feedback
      ${whereClause} AND ai_language IS NOT NULL
      GROUP BY ai_language
      ORDER BY count DESC
    `, params));

    // 13. Key Phrases for Word Cloud
    const keyPhrasesQuery = await db.execute(sql.raw(`
      SELECT
        phrase,
        COUNT(*) as frequency,
        MODE() WITHIN GROUP (ORDER BY ai_sentiment) as dominant_sentiment
      FROM feedback,
           jsonb_array_elements_text(ai_key_phrases) as phrase
      ${whereClause} AND ai_key_phrases IS NOT NULL
      GROUP BY phrase
      ORDER BY frequency DESC
      LIMIT 50
    `, params));

    // 14. Time Analysis (last 30 days)
    const timeAnalysisQuery = await db.execute(sql.raw(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count,
        ROUND(AVG(
          CASE ai_sentiment
            WHEN 'positive' THEN 1.0
            WHEN 'neutral' THEN 0.5
            WHEN 'negative' THEN 0.0
          END
        ), 3) as average_sentiment_score
      FROM feedback
      ${whereClause} AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `, params));

    // 15. Processing Metrics
    const processingMetricsQuery = await db.execute(sql.raw(`
      SELECT
        ROUND(AVG(ai_word_count), 0) as average_word_count,
        ROUND(AVG(ai_character_count), 0) as average_character_count,
        ROUND(AVG(ai_readability_score), 3) as average_readability_score
      FROM feedback
      ${whereClause} AND ai_processed = true
    `, params));

    // Build response
    const analytics: AnalyticsResponse = {
      overview: {
        totalFeedback: parseInt(overview.total_feedback) || 0,
        aiProcessedCount: parseInt(overview.ai_processed_count) || 0,
        averageCSAT: parseFloat(overview.average_csat) || 0,
        processingSuccessRate: parseFloat(overview.processing_success_rate) || 0,
      },
      sentiment: {
        distribution: sentimentQuery.rows.reduce((acc, row) => {
          acc[row.ai_sentiment] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
        trends: sentimentQuery.rows.map(row => ({
          sentiment: row.ai_sentiment,
          count: parseInt(row.count),
          percentage: parseFloat(row.percentage),
        })),
      },
      intent: {
        distribution: intentQuery.rows.reduce((acc, row) => {
          acc[row.ai_intent] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
        topIntents: intentQuery.rows.map(row => ({
          intent: row.ai_intent,
          count: parseInt(row.count),
          averageCSAT: parseFloat(row.average_csat) || 0,
        })),
      },
      priority: {
        distribution: priorityQuery.rows.reduce((acc, row) => {
          acc[row.ai_priority_level] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
        criticalIssues: priorityQuery.rows.find(r => r.ai_priority_level === 'critical')?.count || 0,
        highPriorityIssues: priorityQuery.rows.find(r => r.ai_priority_level === 'high')?.count || 0,
      },
      departments: {
        workload: departmentQuery.rows.reduce((acc, row) => {
          acc[row.ai_department] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
        averageUrgency: departmentQuery.rows.reduce((acc, row) => {
          acc[row.ai_department] = parseFloat(row.average_urgency);
          return acc;
        }, {} as Record<string, number>),
      },
      businessIntelligence: {
        topTags: tagsQuery.rows.map(row => ({
          tag: row.tag,
          count: parseInt(row.count),
        })),
        topTopics: topicsQuery.rows.map(row => ({
          topic: row.topic,
          count: parseInt(row.count),
        })),
        productMentions: productMentionsQuery.rows.map(row => ({
          product: row.product,
          count: parseInt(row.count),
          sentiment: row.dominant_sentiment || 'neutral',
        })),
        featureRequests: featureRequestsQuery.rows.map(row => ({
          feature: row.feature,
          count: parseInt(row.count),
          priority: row.common_priority || 'medium',
        })),
        bugReports: bugReportsQuery.rows.map(row => ({
          bug: row.bug,
          count: parseInt(row.count),
          urgency: parseFloat(row.average_urgency) || 0,
        })),
      },
      customerInsights: {
        customerTypes: {
          new: parseInt(customerInsightsQuery.rows[0]?.new_customers) || 0,
          returning: parseInt(customerInsightsQuery.rows[0]?.returning_customers) || 0,
          power_user: parseInt(customerInsightsQuery.rows[0]?.power_users) || 0,
          enterprise: parseInt(customerInsightsQuery.rows[0]?.enterprise_customers) || 0,
          unknown: parseInt(customerInsightsQuery.rows[0]?.unknown_customers) || 0,
        },
        followUpRequired: parseInt(customerInsightsQuery.rows[0]?.follow_up_required) || 0,
        averageInteractionQuality: parseFloat(customerInsightsQuery.rows[0]?.average_interaction_quality) || 0,
        languageDistribution: languageQuery.rows.reduce((acc, row) => {
          acc[row.ai_language] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
      },
      wordCloud: keyPhrasesQuery.rows.map(row => ({
        phrase: row.phrase,
        frequency: parseInt(row.frequency),
        sentiment: row.dominant_sentiment || 'neutral',
      })),
      timeAnalysis: {
        recentTrends: timeAnalysisQuery.rows.map(row => ({
          date: row.date,
          count: parseInt(row.count),
          averageSentiment: parseFloat(row.average_sentiment_score) || 0.5,
        })),
        processingTimes: {
          averageWordCount: parseInt(processingMetricsQuery.rows[0]?.average_word_count) || 0,
          averageCharacterCount: parseInt(processingMetricsQuery.rows[0]?.average_character_count) || 0,
          readabilityScore: parseFloat(processingMetricsQuery.rows[0]?.average_readability_score) || 0,
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: analytics,
      filters: {
        dateFrom,
        dateTo,
        department,
        sentiment,
      },
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Export types for frontend usage
export type { AnalyticsResponse };
