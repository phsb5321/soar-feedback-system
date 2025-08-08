import OpenAI from "openai";
import Groq from "groq-sdk";

/**
 * AI Feedback Analysis Service
 *
 * Provides comprehensive NLP analysis of user feedback using OpenAI and Groq APIs.
 * Extracts sentiment, emotions, topics, intent, and other valuable insights.
 */

interface AiAnalysisResult {
  // Sentiment Analysis
  sentiment: "positive" | "negative" | "neutral";
  sentimentConfidence: number;

  // Emotion Detection
  emotion: "joy" | "anger" | "sadness" | "fear" | "surprise" | "disgust" | "neutral";
  emotionConfidence: number;

  // Content Analysis
  topics: string[];
  tags: string[];
  keyPhrases: string[];

  // Intent & Purpose
  intent: "complaint" | "praise" | "suggestion" | "question" | "information" | "support";
  intentConfidence: number;

  // Language & Quality
  language: string;
  languageConfidence: number;
  wordCount: number;
  characterCount: number;
  readabilityScore: number;
  formalityScore: number;

  // Business Intelligence
  urgencyScore: number;
  satisfactionPrediction: number;
  priorityLevel: "low" | "medium" | "high" | "critical";
  department: "support" | "sales" | "product" | "engineering" | "management" | "legal";

  // Extracted Entities
  productMentions: string[];
  competitorMentions: string[];
  featureRequests: string[];
  bugReports: string[];
  complianceFlags: string[];

  // Follow-up & Action
  followUpRequired: boolean;
  followUpReason?: string;
  actionItems: string[];
  summary: string;

  // Customer Insights
  customerType: "new" | "returning" | "power_user" | "enterprise" | "unknown";
  interactionQuality: number;

  // Processing Metadata
  modelVersion: string;
  processedAt: Date;
  processingError?: string;
}

interface AnalysisPromptResponse {
  sentiment: {
    label: string;
    confidence: number;
  };
  emotion: {
    primary: string;
    confidence: number;
  };
  topics: string[];
  tags: string[];
  keyPhrases: string[];
  intent: {
    primary: string;
    confidence: number;
  };
  language: {
    code: string;
    confidence: number;
  };
  urgency: number;
  satisfaction: number;
  priority: string;
  department: string;
  entities: {
    products: string[];
    competitors: string[];
    features: string[];
    bugs: string[];
    compliance: string[];
  };
  followUp: {
    required: boolean;
    reason?: string;
  };
  actionItems: string[];
  summary: string;
  customerType: string;
  quality: number;
  formality: number;
  readability: number;
}

export class AiFeedbackAnalysisService {
  private openai: OpenAI | null = null;
  private groq: Groq | null = null;
  private modelVersion = "gpt-4o-mini-2024-07-18";

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.GROQ_API_KEY) {
      this.groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
    }
  }

  /**
   * Analyze feedback transcription and extract comprehensive insights
   */
  async analyzeFeedback(transcription: string, csat?: number): Promise<AiAnalysisResult> {
    try {
      const basicMetrics = this.calculateBasicMetrics(transcription);

      // Try Groq first (faster), fallback to OpenAI
      let aiAnalysis: AnalysisPromptResponse;

      try {
        aiAnalysis = await this.analyzeWithGroq(transcription, csat);
      } catch (groqError) {
        console.warn("Groq analysis failed, falling back to OpenAI:", groqError);
        aiAnalysis = await this.analyzeWithOpenAI(transcription, csat);
      }

      return {
        // Sentiment & Emotion
        sentiment: this.normalizeSentiment(aiAnalysis.sentiment.label),
        sentimentConfidence: aiAnalysis.sentiment.confidence,
        emotion: this.normalizeEmotion(aiAnalysis.emotion.primary),
        emotionConfidence: aiAnalysis.emotion.confidence,

        // Content Analysis
        topics: aiAnalysis.topics,
        tags: aiAnalysis.tags,
        keyPhrases: aiAnalysis.keyPhrases,

        // Intent & Language
        intent: this.normalizeIntent(aiAnalysis.intent.primary),
        intentConfidence: aiAnalysis.intent.confidence,
        language: aiAnalysis.language.code,
        languageConfidence: aiAnalysis.language.confidence,

        // Metrics
        wordCount: basicMetrics.wordCount,
        characterCount: basicMetrics.characterCount,
        readabilityScore: Math.max(0, Math.min(1, aiAnalysis.readability)),
        formalityScore: Math.max(0, Math.min(1, aiAnalysis.formality)),

        // Business Intelligence
        urgencyScore: Math.max(0, Math.min(1, aiAnalysis.urgency)),
        satisfactionPrediction: csat !== undefined ? csat / 10 : Math.max(0, Math.min(1, aiAnalysis.satisfaction)),
        priorityLevel: this.normalizePriority(aiAnalysis.priority),
        department: this.normalizeDepartment(aiAnalysis.department),

        // Extracted Entities
        productMentions: aiAnalysis.entities.products,
        competitorMentions: aiAnalysis.entities.competitors,
        featureRequests: aiAnalysis.entities.features,
        bugReports: aiAnalysis.entities.bugs,
        complianceFlags: aiAnalysis.entities.compliance,

        // Follow-up & Actions
        followUpRequired: aiAnalysis.followUp.required,
        followUpReason: aiAnalysis.followUp.reason,
        actionItems: aiAnalysis.actionItems,
        summary: aiAnalysis.summary,

        // Customer Insights
        customerType: this.normalizeCustomerType(aiAnalysis.customerType),
        interactionQuality: Math.max(0, Math.min(1, aiAnalysis.quality)),

        // Metadata
        modelVersion: this.modelVersion,
        processedAt: new Date(),
      };

    } catch (error) {
      console.error("AI analysis failed:", error);

      // Return basic analysis with error
      const basicMetrics = this.calculateBasicMetrics(transcription);
      return {
        ...this.getBasicFallbackAnalysis(transcription, csat),
        ...basicMetrics,
        modelVersion: this.modelVersion,
        processedAt: new Date(),
        processingError: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Analyze with Groq (faster, cheaper)
   */
  private async analyzeWithGroq(transcription: string, csat?: number): Promise<AnalysisPromptResponse> {
    if (!this.groq) {
      throw new Error("Groq client not initialized");
    }

    const prompt = this.buildAnalysisPrompt(transcription, csat);

    const response = await this.groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: this.getSystemPrompt(),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from Groq");
    }

    return JSON.parse(content);
  }

  /**
   * Analyze with OpenAI (more accurate, more expensive)
   */
  private async analyzeWithOpenAI(transcription: string, csat?: number): Promise<AnalysisPromptResponse> {
    if (!this.openai) {
      throw new Error("OpenAI client not initialized");
    }

    const prompt = this.buildAnalysisPrompt(transcription, csat);

    const response = await this.openai.chat.completions.create({
      model: this.modelVersion,
      messages: [
        {
          role: "system",
          content: this.getSystemPrompt(),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(content);
  }

  /**
   * Build the analysis prompt
   */
  private buildAnalysisPrompt(transcription: string, csat?: number): string {
    return `
Analyze the following customer feedback transcription and provide a comprehensive analysis in JSON format.

Transcription: "${transcription}"
${csat !== undefined ? `Customer Satisfaction Score: ${csat}/10` : ""}

Please analyze and return the exact JSON structure as specified in the system prompt.
Focus on extracting actionable insights and accurate classification.
Consider the Brazilian Portuguese context and business culture.
    `.trim();
  }

  /**
   * System prompt for AI analysis
   */
  private getSystemPrompt(): string {
    return `
You are an expert AI analyst specializing in customer feedback analysis for Brazilian businesses.
Your task is to analyze customer feedback transcriptions and extract comprehensive insights.

You MUST respond with a valid JSON object containing the following exact structure:

{
  "sentiment": {
    "label": "positive|negative|neutral",
    "confidence": 0.0-1.0
  },
  "emotion": {
    "primary": "joy|anger|sadness|fear|surprise|disgust|neutral",
    "confidence": 0.0-1.0
  },
  "topics": ["array", "of", "main", "topics"],
  "tags": ["array", "of", "relevant", "tags"],
  "keyPhrases": ["important", "phrases", "from", "text"],
  "intent": {
    "primary": "complaint|praise|suggestion|question|information|support",
    "confidence": 0.0-1.0
  },
  "language": {
    "code": "pt|en|es|fr|etc",
    "confidence": 0.0-1.0
  },
  "urgency": 0.0-1.0,
  "satisfaction": 0.0-1.0,
  "priority": "low|medium|high|critical",
  "department": "support|sales|product|engineering|management|legal",
  "entities": {
    "products": ["mentioned", "products"],
    "competitors": ["mentioned", "competitors"],
    "features": ["requested", "features"],
    "bugs": ["reported", "bugs"],
    "compliance": ["legal", "compliance", "issues"]
  },
  "followUp": {
    "required": true|false,
    "reason": "optional reason if required"
  },
  "actionItems": ["specific", "actionable", "items"],
  "summary": "concise summary of the feedback",
  "customerType": "new|returning|power_user|enterprise|unknown",
  "quality": 0.0-1.0,
  "formality": 0.0-1.0,
  "readability": 0.0-1.0
}

Guidelines:
- Be precise and objective in your analysis
- Consider Brazilian Portuguese expressions and cultural context
- Focus on actionable insights for business improvement
- Extract specific product/service mentions
- Identify potential legal or compliance issues
- Assess urgency based on customer tone and content
- Provide meaningful tags that would help categorize the feedback
- Keep summaries concise but informative (max 200 characters)
- Ensure all confidence scores are realistic (0.7+ for high confidence)
    `.trim();
  }

  /**
   * Calculate basic text metrics
   */
  private calculateBasicMetrics(text: string) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const characters = text.length;

    return {
      wordCount: words.length,
      characterCount: characters,
    };
  }

  /**
   * Normalization methods to ensure consistent data
   */
  private normalizeSentiment(sentiment: string): "positive" | "negative" | "neutral" {
    const s = sentiment.toLowerCase();
    if (s.includes("positive") || s.includes("positiv")) return "positive";
    if (s.includes("negative") || s.includes("negativ")) return "negative";
    return "neutral";
  }

  private normalizeEmotion(emotion: string): "joy" | "anger" | "sadness" | "fear" | "surprise" | "disgust" | "neutral" {
    const e = emotion.toLowerCase();
    if (e.includes("joy") || e.includes("happiness") || e.includes("alegria")) return "joy";
    if (e.includes("anger") || e.includes("raiva") || e.includes("irritation")) return "anger";
    if (e.includes("sadness") || e.includes("tristeza") || e.includes("sad")) return "sadness";
    if (e.includes("fear") || e.includes("medo") || e.includes("anxiety")) return "fear";
    if (e.includes("surprise") || e.includes("surpresa")) return "surprise";
    if (e.includes("disgust") || e.includes("nojo") || e.includes("repugnance")) return "disgust";
    return "neutral";
  }

  private normalizeIntent(intent: string): "complaint" | "praise" | "suggestion" | "question" | "information" | "support" {
    const i = intent.toLowerCase();
    if (i.includes("complaint") || i.includes("reclamação") || i.includes("problema")) return "complaint";
    if (i.includes("praise") || i.includes("elogio") || i.includes("compliment")) return "praise";
    if (i.includes("suggestion") || i.includes("sugestão") || i.includes("recommend")) return "suggestion";
    if (i.includes("question") || i.includes("pergunta") || i.includes("dúvida")) return "question";
    if (i.includes("support") || i.includes("suporte") || i.includes("ajuda")) return "support";
    return "information";
  }

  private normalizePriority(priority: string): "low" | "medium" | "high" | "critical" {
    const p = priority.toLowerCase();
    if (p.includes("critical") || p.includes("crítico") || p.includes("urgent")) return "critical";
    if (p.includes("high") || p.includes("alto") || p.includes("importante")) return "high";
    if (p.includes("low") || p.includes("baixo") || p.includes("minor")) return "low";
    return "medium";
  }

  private normalizeDepartment(department: string): "support" | "sales" | "product" | "engineering" | "management" | "legal" {
    const d = department.toLowerCase();
    if (d.includes("sales") || d.includes("vendas") || d.includes("comercial")) return "sales";
    if (d.includes("product") || d.includes("produto")) return "product";
    if (d.includes("engineering") || d.includes("engenharia") || d.includes("tech")) return "engineering";
    if (d.includes("management") || d.includes("gerência") || d.includes("diretor")) return "management";
    if (d.includes("legal") || d.includes("jurídico") || d.includes("compliance")) return "legal";
    return "support";
  }

  private normalizeCustomerType(customerType: string): "new" | "returning" | "power_user" | "enterprise" | "unknown" {
    const c = customerType.toLowerCase();
    if (c.includes("new") || c.includes("novo") || c.includes("first")) return "new";
    if (c.includes("returning") || c.includes("recorrente") || c.includes("regular")) return "returning";
    if (c.includes("power") || c.includes("advanced") || c.includes("expert")) return "power_user";
    if (c.includes("enterprise") || c.includes("empresarial") || c.includes("corporate")) return "enterprise";
    return "unknown";
  }

  /**
   * Basic fallback analysis when AI fails
   */
  private getBasicFallbackAnalysis(transcription: string, csat?: number): Partial<AiAnalysisResult> {
    const basicMetrics = this.calculateBasicMetrics(transcription);

    // Simple sentiment based on keywords
    const text = transcription.toLowerCase();
    let sentiment: "positive" | "negative" | "neutral" = "neutral";

    const positiveWords = ["bom", "ótimo", "excelente", "maravilhoso", "perfeito", "adorei", "gostei"];
    const negativeWords = ["ruim", "péssimo", "terrível", "horrível", "problema", "erro", "falha"];

    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;

    if (positiveCount > negativeCount) sentiment = "positive";
    else if (negativeCount > positiveCount) sentiment = "negative";

    return {
      sentiment,
      sentimentConfidence: 0.3, // Low confidence for basic analysis
      emotion: "neutral",
      emotionConfidence: 0.3,
      topics: ["general"],
      tags: ["basic"],
      keyPhrases: [],
      intent: "information",
      intentConfidence: 0.3,
      language: "pt",
      languageConfidence: 0.8,
      readabilityScore: 0.5,
      formalityScore: 0.5,
      urgencyScore: 0.3,
      satisfactionPrediction: csat ? csat / 10 : 0.5,
      priorityLevel: "medium",
      department: "support",
      productMentions: [],
      competitorMentions: [],
      featureRequests: [],
      bugReports: [],
      complianceFlags: [],
      followUpRequired: false,
      actionItems: [],
      summary: transcription.slice(0, 100) + "...",
      customerType: "unknown",
      interactionQuality: 0.5,
    };
  }
}

// Singleton instance
export const aiFeedbackAnalysisService = new AiFeedbackAnalysisService();
