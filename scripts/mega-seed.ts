#!/usr/bin/env tsx

import { sql } from "drizzle-orm";
import { db, testConnection, closeConnections } from "../drizzle/config";
import { feedback } from "../drizzle/schema";
import { aiFeedbackAnalysisService } from "../src/services/AiFeedbackAnalysisService";

/**
 * Comprehensive Mega Seed Script for SOAR Feedback System
 *
 * Generates realistic Brazilian Portuguese feedback data with:
 * - Diverse customer scenarios and contexts
 * - Various sentiment levels and emotions
 * - Different industries and use cases
 * - Regional Brazilian expressions and cultural nuances
 * - Comprehensive AI analysis for each entry
 */

interface SeedFeedback {
  transcription: string;
  csat?: number;
  additional_comment?: string;
  context: string;
  expectedSentiment: "positive" | "negative" | "neutral";
  expectedIntent: string;
}

// Comprehensive Brazilian Portuguese feedback dataset
const seedData: SeedFeedback[] = [
  // === EXTREMELY POSITIVE FEEDBACK ===
  {
    transcription:
      "Cara, que experiência incrível! O atendimento foi simplesmente perfeito, a equipe super atenciosa e profissional. O produto chegou muito antes do prazo e a qualidade superou todas as minhas expectativas. Já recomendei para toda minha família e amigos. Vocês estão de parabéns mesmo! Nota mil!",
    csat: 10,
    additional_comment: "Melhor empresa que já conheci",
    context: "Exceptional customer service experience",
    expectedSentiment: "positive",
    expectedIntent: "praise",
  },
  {
    transcription:
      "Nossa, que sistema fantástico! Consegui resolver tudo em poucos minutos, muito intuitivo e fácil de usar. A interface está linda e funciona perfeitamente. Meus parabéns para toda a equipe de desenvolvimento. Isso sim é inovação! Continuem assim que vocês vão longe.",
    csat: 10,
    additional_comment: "Interface excepcional",
    context: "Software/platform praise",
    expectedSentiment: "positive",
    expectedIntent: "praise",
  },
  {
    transcription:
      "Excelente trabalho! O delivery foi super rápido, o produto veio exatamente como descrito e o suporte pós-venda é exemplar. Quando tive uma dúvida, fui atendido na hora por uma pessoa super educada e competente. Empresa de primeira linha mesmo!",
    csat: 9,
    additional_comment: "Suporte excepcional",
    context: "E-commerce positive experience",
    expectedSentiment: "positive",
    expectedIntent: "praise",
  },

  // === POSITIVE WITH SUGGESTIONS ===
  {
    transcription:
      "Gostei muito do serviço, foi bem completo e profissional. O atendente foi muito simpático e resolveu meu problema rapidinho. Só uma sugestãozinha: seria legal se vocês tivessem um chat online pra gente não precisar ligar sempre. Mas no geral, estou muito satisfeito!",
    csat: 8,
    additional_comment: "Sugiro implementar chat online",
    context: "Positive feedback with improvement suggestion",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },
  {
    transcription:
      "Adorei a plataforma! É muito fácil de navegar e tem tudo que preciso. O design está moderno e bonito. Uma ideia que tenho é adicionar um modo escuro, porque uso muito à noite e seria mais confortável pros olhos. Fora isso, tá perfeita!",
    csat: 8,
    additional_comment: "Modo escuro seria ótimo",
    context: "UI/UX feedback with feature request",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },
  {
    transcription:
      "Ótima experiência! O produto é de qualidade excelente e chegou certinho no prazo. O único ponto que poderia melhorar é a embalagem, que veio meio amassada. Talvez um material mais resistente ajudasse. Mas o conteúdo tava perfeito!",
    csat: 8,
    additional_comment: "Melhorar embalagem",
    context: "Product quality feedback",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },

  // === NEUTRAL INFORMATIONAL ===
  {
    transcription:
      "Bom dia! Estou ligando para saber sobre o status do meu pedido número 12345. Fiz a compra na semana passada e ainda não recebi o código de rastreamento. Podem me ajudar com essa informação? Obrigado!",
    csat: 7,
    context: "Information request about order status",
    expectedSentiment: "neutral",
    expectedIntent: "question",
  },
  {
    transcription:
      "Oi, pessoal! Gostaria de entender melhor como funciona o plano premium de vocês. Quais são os benefícios inclusos? Tem período de teste gratuito? E se eu quiser cancelar depois, como funciona? Desde já agradeço as informações.",
    csat: 7,
    context: "Product inquiry about premium features",
    expectedSentiment: "neutral",
    expectedIntent: "question",
  },
  {
    transcription:
      "Olá! Sou novo aqui na plataforma e estou tentando entender como configurar meu perfil corretamente. Já li a documentação, mas ainda tenho algumas dúvidas específicas sobre as notificações. Vocês podem me orientar?",
    context: "New user onboarding inquiry",
    expectedSentiment: "neutral",
    expectedIntent: "support",
  },

  // === MIXED FEEDBACK ===
  {
    transcription:
      "Olha, o produto em si é muito bom, gostei da qualidade. Mas o atendimento deixou a desejar. Demorou uns 15 minutos pra ser atendido e quando finalmente falei com alguém, a pessoa parecia meio perdida. Espero que melhorem esse ponto porque o resto tá ok.",
    csat: 6,
    additional_comment: "Atendimento precisa melhorar",
    context: "Mixed experience - good product, poor service",
    expectedSentiment: "neutral",
    expectedIntent: "complaint",
  },
  {
    transcription:
      "A plataforma tem funcionalidades interessantes e é bem completa, isso eu reconheço. Porém, é muito lenta às vezes, principalmente no horário de pico. E a navegação no mobile poderia ser mais intuitiva. Tem potencial, mas precisa de alguns ajustes.",
    csat: 6,
    additional_comment: "Performance e mobile precisam melhorar",
    context: "Platform performance issues",
    expectedSentiment: "neutral",
    expectedIntent: "complaint",
  },

  // === NEGATIVE BUT CONSTRUCTIVE ===
  {
    transcription:
      "Pessoal, infelizmente tive uma experiência bem frustrante. O produto que recebi não confere com a descrição do site. A cor é diferente e o tamanho também. Já tentei entrar em contato pelo WhatsApp mas ninguém responde. Preciso de uma solução urgente, por favor.",
    csat: 3,
    additional_comment: "Produto diferente do anunciado",
    context: "Product mismatch complaint",
    expectedSentiment: "negative",
    expectedIntent: "complaint",
  },
  {
    transcription:
      "Estou decepcionado com o serviço. Paguei pelo plano premium esperando um suporte mais ágil, mas já faz 3 dias que abri um chamado e ainda não tive retorno. Para o valor que cobram, esperava bem mais. Vou avaliar se vale a pena continuar.",
    csat: 4,
    additional_comment: "Suporte demorado para plano premium",
    context: "Premium support disappointment",
    expectedSentiment: "negative",
    expectedIntent: "complaint",
  },

  // === TECHNICAL ISSUES ===
  {
    transcription:
      "Oi! Estou tendo um problema técnico aqui. Sempre que tento fazer upload de um arquivo maior que 10MB, a página trava e não consigo finalizar. Já tentei em navegadores diferentes e o problema persiste. Podem verificar se há alguma limitação ou bug?",
    csat: 5,
    additional_comment: "Bug no upload de arquivos grandes",
    context: "Technical bug report",
    expectedSentiment: "neutral",
    expectedIntent: "support",
  },
  {
    transcription:
      "Galera, a integração com o sistema que uso aqui na empresa não está funcionando direito. Os dados não estão sincronizando e isso está afetando nosso workflow. Já verificamos nossa configuração e está tudo certo. Precisamos de suporte técnico urgente.",
    csat: 4,
    additional_comment: "Problema de integração crítico",
    context: "Integration failure - business critical",
    expectedSentiment: "negative",
    expectedIntent: "support",
  },

  // === REGIONAL BRAZILIAN EXPRESSIONS ===
  {
    transcription:
      "Ô meu, que negócio massa! Ficou show de bola mesmo. O pessoal aí é gente fina demais, me ajudaram com a maior boa vontade. Tá de parabéns viu! Já falei pra galera daqui que vocês são top. Valeu mesmo!",
    csat: 9,
    additional_comment: "Atendimento show de bola",
    context: "Informal positive feedback with regional slang",
    expectedSentiment: "positive",
    expectedIntent: "praise",
  },
  {
    transcription:
      "Rapaz, que experiência ruim! O negócio não funcionou direito desde o começo. Tentei ligar umas três vezes e só deu ocupado. Quando finalmente consegui falar com alguém, a pessoa não soube me ajudar. Não é possível uma coisa dessas!",
    csat: 2,
    additional_comment: "Experiência muito ruim",
    context: "Frustrated customer with regional expressions",
    expectedSentiment: "negative",
    expectedIntent: "complaint",
  },

  // === BUSINESS/ENTERPRISE FEEDBACK ===
  {
    transcription:
      "Prezados, como responsável pela área de TI da nossa empresa, gostaria de parabenizar vocês pela solução implementada. A migração foi feita sem intercorrências e a equipe de suporte demonstrou alto nível técnico. Recomendaremos para outras filiais da nossa rede.",
    csat: 9,
    additional_comment: "Excelente para ambiente corporativo",
    context: "Enterprise/B2B positive feedback",
    expectedSentiment: "positive",
    expectedIntent: "praise",
  },
  {
    transcription:
      "Senhores, estamos enfrentando sérias dificuldades com a performance do sistema durante nossos picos de vendas. Isso está impactando diretamente nosso faturamento. Precisamos de uma solução urgente ou teremos que considerar outras alternativas no mercado.",
    csat: 3,
    additional_comment: "Performance crítica para negócio",
    context: "Enterprise performance complaint",
    expectedSentiment: "negative",
    expectedIntent: "complaint",
  },

  // === FEATURE REQUESTS ===
  {
    transcription:
      "A plataforma está muito boa! Queria sugerir algumas funcionalidades que fariam toda diferença: relatórios mais detalhados, notificações push e talvez uma integração com Google Analytics. Isso tornaria o sistema ainda mais completo. O que acham?",
    csat: 8,
    additional_comment: "Sugestões de melhorias",
    context: "Multiple feature requests",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },
  {
    transcription:
      "Seria incrível se vocês adicionassem uma funcionalidade de agendamento automático. Uso muito sistemas parecidos e essa feature sempre faz a diferença no dia a dia. Também seria legal ter um dashboard mais customizável. Ficam as dicas!",
    csat: 7,
    additional_comment: "Agendamento automático seria útil",
    context: "Specific feature suggestions",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },

  // === COMPETITOR MENTIONS ===
  {
    transcription:
      "Vocês estão no caminho certo, mas ainda falta um pouco para chegar no nível do que vejo na concorrência. O Mercado Livre, por exemplo, tem um processo de devolução muito mais simples. Se conseguirem simplificar isso aqui, seria perfeito.",
    csat: 6,
    additional_comment: "Processo de devolução poderia ser mais simples",
    context: "Comparison with competitor",
    expectedSentiment: "neutral",
    expectedIntent: "suggestion",
  },

  // === EMOTIONAL/PERSONAL STORIES ===
  {
    transcription:
      "Gente, vocês não fazem ideia de como me ajudaram! Estava desesperada tentando resolver isso para o aniversário da minha filha. O atendente foi um anjo, ficou comigo até conseguirmos uma solução. Chorei de emoção quando deu certo. Muito obrigada mesmo!",
    csat: 10,
    additional_comment: "Salvaram o aniversário da minha filha",
    context: "Emotional positive story",
    expectedSentiment: "positive",
    expectedIntent: "praise",
  },
  {
    transcription:
      "Olha, sou cliente há anos e sempre gostei do serviço de vocês. Mas dessa vez me senti desrespeitado. O atendente foi grosseiro e me fez perder tempo. Espero que isso não volte a acontecer porque realmente gosto da empresa.",
    csat: 4,
    additional_comment: "Cliente antigo decepcionado",
    context: "Long-term customer disappointment",
    expectedSentiment: "negative",
    expectedIntent: "complaint",
  },

  // === SECURITY/PRIVACY CONCERNS ===
  {
    transcription:
      "Pessoal, estou preocupado com a segurança dos meus dados aqui na plataforma. Li nas notícias sobre vazamentos em outras empresas e queria saber que medidas vocês tomam para proteger nossas informações. Podem me dar detalhes sobre isso?",
    csat: 6,
    additional_comment: "Preocupação com segurança de dados",
    context: "Security/privacy inquiry",
    expectedSentiment: "neutral",
    expectedIntent: "question",
  },

  // === ACCESSIBILITY FEEDBACK ===
  {
    transcription:
      "Como pessoa com deficiência visual, preciso dizer que o site de vocês está bem acessível! Consigo navegar tranquilamente com meu leitor de tela. Só uma sugestão: seria ótimo se tivessem descrições mais detalhadas nas imagens dos produtos.",
    csat: 8,
    additional_comment: "Acessibilidade boa, mas pode melhorar",
    context: "Accessibility feedback",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },

  // === PRICING/VALUE CONCERNS ===
  {
    transcription:
      "Gosto do produto, mas acho que o preço está um pouco salgado para o que oferece. Comparando com outras opções do mercado, vocês poderiam ser mais competitivos. Se baixassem uns 20%, seria mais justo na minha opinião.",
    csat: 6,
    additional_comment: "Preço elevado comparado à concorrência",
    context: "Pricing feedback",
    expectedSentiment: "neutral",
    expectedIntent: "suggestion",
  },

  // === MOBILE APP FEEDBACK ===
  {
    transcription:
      "O app mobile de vocês é muito útil, uso sempre! Mas está crashando bastante aqui no meu iPhone. Principalmente quando tento acessar o histórico de pedidos. Já reinstalei e o problema continua. Podem verificar isso?",
    csat: 6,
    additional_comment: "App iOS com crashes frequentes",
    context: "Mobile app technical issues",
    expectedSentiment: "neutral",
    expectedIntent: "support",
  },

  // === DELIVERY/LOGISTICS ===
  {
    transcription:
      "A entrega foi super rápida, chegou até antes do prazo! Mas o entregador não seguiu as instruções que deixei e acabou acordando meu bebê. Da próxima vez, por favor, orientem melhor sobre tocar a campainha devagar.",
    csat: 7,
    additional_comment: "Entrega rápida, mas orientações não seguidas",
    context: "Delivery experience feedback",
    expectedSentiment: "neutral",
    expectedIntent: "suggestion",
  },

  // === VERY NEGATIVE EXPERIENCES ===
  {
    transcription:
      "Estou extremamente insatisfeito! Já faz uma semana que meu pedido está em trânsito e simplesmente sumiu. O rastreamento não atualiza, ninguém sabe informar onde está e ainda por cima querem que eu espere mais. Isso é um absurdo! Quero meu dinheiro de volta!",
    csat: 1,
    additional_comment: "Pedido perdido, atendimento péssimo",
    context: "Lost package and poor service",
    expectedSentiment: "negative",
    expectedIntent: "complaint",
  },
  {
    transcription:
      "Que decepção! Gastei uma grana boa esperando qualidade e recebi um produto completamente diferente. Parece que nem conferiram antes de enviar. E quando ligo reclamando, fica todo mundo se empurrando, ninguém assume a responsabilidade. Não recomendo!",
    csat: 2,
    additional_comment: "Produto errado e falta de responsabilidade",
    context: "Wrong product and poor accountability",
    expectedSentiment: "negative",
    expectedIntent: "complaint",
  },

  // === SPECIFIC INDUSTRY CONTEXTS ===
  {
    transcription:
      "Como médico, preciso de um sistema confiável para gerenciar meus pacientes. Vocês atendem muito bem essa necessidade! O sistema é intuitivo e cumpre todas as normas do CFM. Só precisaria de uns relatórios mais específicos para auditorias.",
    csat: 8,
    additional_comment: "Bom para área médica, faltam relatórios específicos",
    context: "Healthcare professional feedback",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },
  {
    transcription:
      "Sou professora e comecei a usar a plataforma para minhas aulas online. Os alunos adoraram! É muito fácil de usar e tem todas as ferramentas que preciso. Só senti falta de uma função para criar grupos de estudo. Seria perfeito!",
    csat: 9,
    additional_comment: "Excelente para educação",
    context: "Education sector feedback",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },

  // === COVID/PANDEMIC RELATED ===
  {
    transcription:
      "Durante a pandemia, vocês foram essenciais para manter meu negócio funcionando. O suporte remoto é excelente e conseguimos migrar tudo online sem problemas. Agora que estamos voltando ao presencial, seria legal ter uma versão híbrida.",
    csat: 9,
    additional_comment: "Salvaram o negócio na pandemia",
    context: "Pandemic business continuity",
    expectedSentiment: "positive",
    expectedIntent: "praise",
  },

  // === CULTURAL/SEASONAL REFERENCES ===
  {
    transcription:
      "Que presente de Natal mais perfeito! Minha mãe ficou emocionada quando chegou. Veio tudo certinho, bem embalado e com um cartãozinho fofo. Vocês pensam em cada detalhe. Já separei vocês para as próximas festas juninas!",
    csat: 10,
    additional_comment: "Perfeito para presentes",
    context: "Holiday/seasonal positive experience",
    expectedSentiment: "positive",
    expectedIntent: "praise",
  },

  // === ENVIRONMENTAL/SUSTAINABILITY ===
  {
    transcription:
      "Parabéns pela iniciativa sustentável! Adorei que a embalagem é toda reciclável e vocês usam energia renovável. É importante ver empresas se preocupando com o meio ambiente. Só uma sugestão: que tal oferecer opção de entrega com bicicleta em algumas regiões?",
    csat: 8,
    additional_comment: "Gostei das práticas sustentáveis",
    context: "Sustainability appreciation",
    expectedSentiment: "positive",
    expectedIntent: "suggestion",
  },

  // === INTERNATIONAL/IMPORT ISSUES ===
  {
    transcription:
      "Comprei um produto internacional através de vocês e foi uma saga! Ficou preso na Receita Federal por semanas. Sei que não é culpa de vocês, mas seria legal ter mais orientações sobre taxas e prazos para importados.",
    csat: 5,
    additional_comment: "Faltam informações sobre produtos importados",
    context: "International shipping complexity",
    expectedSentiment: "neutral",
    expectedIntent: "suggestion",
  },
];

/**
 * Run the mega seed operation
 */
async function runMegaSeed(): Promise<void> {
  console.log("🌱 Starting MEGA SEED operation for SOAR Feedback System");
  console.log("=".repeat(60));

  try {
    // Test database connection
    console.log("🔌 Testing database connection...");
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Database connection failed");
    }
    console.log("✅ Database connection successful");

    // Clear existing data (optional - comment out to preserve existing data)
    console.log("🧹 Clearing existing feedback data...");
    await db.delete(feedback);
    console.log("✅ Existing data cleared");

    console.log(
      `\n📊 Preparing to seed ${seedData.length} feedback entries...`,
    );
    console.log(
      "🤖 Each entry will be analyzed by AI for comprehensive insights\n",
    );

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < seedData.length; i++) {
      const feedbackData = seedData[i];
      const progress = `[${i + 1}/${seedData.length}]`;

      try {
        console.log(`${progress} Processing: ${feedbackData.context}`);
        console.log(
          `   Transcription: "${feedbackData.transcription.substring(0, 60)}..."`,
        );

        // Insert basic feedback first
        const result = await db
          .insert(feedback)
          .values({
            audio_url: `seed_audio_${i + 1}.webm`,
            transcription: feedbackData.transcription,
            csat: feedbackData.csat,
            additional_comment: feedbackData.additional_comment,
            ai_processed: false,
          })
          .returning();

        const feedbackId = result[0].id;

        // Run AI analysis
        console.log(`   🤖 Running AI analysis...`);
        const aiAnalysis = await aiFeedbackAnalysisService.analyzeFeedback(
          feedbackData.transcription,
          feedbackData.csat,
        );

        // Update with AI analysis
        await db
          .update(feedback)
          .set({
            ai_tags: aiAnalysis.tags,
            ai_sentiment: aiAnalysis.sentiment,
            ai_sentiment_confidence: aiAnalysis.sentimentConfidence,
            ai_emotion: aiAnalysis.emotion,
            ai_emotion_confidence: aiAnalysis.emotionConfidence,
            ai_topics: aiAnalysis.topics,
            ai_key_phrases: aiAnalysis.keyPhrases,
            ai_language: aiAnalysis.language,
            ai_language_confidence: aiAnalysis.languageConfidence,
            ai_urgency_score: aiAnalysis.urgencyScore,
            ai_satisfaction_prediction: aiAnalysis.satisfactionPrediction,
            ai_intent: aiAnalysis.intent,
            ai_intent_confidence: aiAnalysis.intentConfidence,
            ai_word_count: aiAnalysis.wordCount,
            ai_character_count: aiAnalysis.characterCount,
            ai_readability_score: aiAnalysis.readabilityScore,
            ai_formality_score: aiAnalysis.formalityScore,
            ai_processed: true,
            ai_processing_error: aiAnalysis.processingError || null,
            ai_model_version: aiAnalysis.modelVersion,
            ai_processed_at: aiAnalysis.processedAt,
            ai_summary: aiAnalysis.summary,
            ai_action_items: aiAnalysis.actionItems,
            ai_priority_level: aiAnalysis.priorityLevel,
            ai_department: aiAnalysis.department,
            ai_product_mentions: aiAnalysis.productMentions,
            ai_competitor_mentions: aiAnalysis.competitorMentions,
            ai_feature_requests: aiAnalysis.featureRequests,
            ai_bug_reports: aiAnalysis.bugReports,
            ai_compliance_flags: aiAnalysis.complianceFlags,
            ai_follow_up_required: aiAnalysis.followUpRequired,
            ai_follow_up_reason: aiAnalysis.followUpReason || null,
            ai_customer_type: aiAnalysis.customerType,
            ai_interaction_quality: aiAnalysis.interactionQuality,
          })
          .where(sql`id = ${feedbackId}`);

        console.log(`   ✅ Feedback ${feedbackId} created with AI analysis`);
        console.log(
          `   📊 Sentiment: ${aiAnalysis.sentiment} (${Math.round(aiAnalysis.sentimentConfidence * 100)}%)`,
        );
        console.log(
          `   🎯 Intent: ${aiAnalysis.intent} | Priority: ${aiAnalysis.priorityLevel}`,
        );
        console.log(
          `   🏷️ Tags: ${aiAnalysis.tags.slice(0, 3).join(", ")}${aiAnalysis.tags.length > 3 ? "..." : ""}`,
        );
        console.log("");

        successCount++;

        // Small delay to avoid overwhelming the AI APIs
        if (i < seedData.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`   ❌ Failed to process feedback ${i + 1}:`, error);
        errorCount++;
      }
    }

    // Final statistics
    console.log("=".repeat(60));
    console.log("📈 MEGA SEED COMPLETION SUMMARY");
    console.log(`✅ Successfully seeded: ${successCount} entries`);
    console.log(`❌ Failed entries: ${errorCount} entries`);
    console.log(
      `📊 Success rate: ${Math.round((successCount / seedData.length) * 100)}%`,
    );

    if (successCount > 0) {
      // Generate analytics summary
      const analytics = await generateAnalyticsSummary();
      console.log("\n📊 DATASET ANALYTICS:");
      console.log(`   Total feedback entries: ${analytics.total}`);
      console.log(
        `   Sentiment distribution: ${analytics.sentimentDistribution}`,
      );
      console.log(`   Most common intents: ${analytics.topIntents.join(", ")}`);
      console.log(`   Average CSAT: ${analytics.averageCSAT}`);
      console.log(`   High priority issues: ${analytics.highPriorityCount}`);
      console.log(
        `   AI processing success: ${analytics.aiProcessingSuccess}%`,
      );
    }

    console.log("\n🎉 Mega seed operation completed successfully!");
    console.log(
      "🚀 Your SOAR Feedback System now has comprehensive test data!",
    );
  } catch (error) {
    console.error("💥 Mega seed operation failed:", error);
    throw error;
  } finally {
    await closeConnections();
  }
}

/**
 * Generate analytics summary of the seeded data
 */
async function generateAnalyticsSummary() {
  const totalResult = await db.execute(
    sql`SELECT COUNT(*) as count FROM feedback`,
  );
  const total = totalResult.rows[0]?.count || 0;

  const sentimentResult = await db.execute(sql`
    SELECT ai_sentiment, COUNT(*) as count
    FROM feedback
    WHERE ai_sentiment IS NOT NULL
    GROUP BY ai_sentiment
  `);

  const intentResult = await db.execute(sql`
    SELECT ai_intent, COUNT(*) as count
    FROM feedback
    WHERE ai_intent IS NOT NULL
    GROUP BY ai_intent
    ORDER BY count DESC
    LIMIT 3
  `);

  const csatResult = await db.execute(sql`
    SELECT AVG(csat) as avg_csat
    FROM feedback
    WHERE csat IS NOT NULL
  `);

  const highPriorityResult = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM feedback
    WHERE ai_priority_level IN ('high', 'critical')
  `);

  const aiSuccessResult = await db.execute(sql`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN ai_processed = true AND ai_processing_error IS NULL THEN 1 END) as success
    FROM feedback
  `);

  const sentimentDist = sentimentResult.rows
    .map((row) => `${row.ai_sentiment}: ${row.count}`)
    .join(", ");

  const topIntents = intentResult.rows
    .map((row) => row.ai_intent)
    .filter(Boolean);

  const aiStats = aiSuccessResult.rows[0] as { total: number; success: number };
  const aiSuccessRate =
    aiStats?.total > 0
      ? Math.round((Number(aiStats.success) / Number(aiStats.total)) * 100)
      : 0;

  return {
    total,
    sentimentDistribution: sentimentDist || "N/A",
    topIntents,
    averageCSAT: csatResult.rows[0]?.avg_csat
      ? Math.round(parseFloat(String(csatResult.rows[0].avg_csat)) * 10) / 10
      : "N/A",
    highPriorityCount: highPriorityResult.rows[0]?.count || 0,
    aiProcessingSuccess: aiSuccessRate,
  };
}

/**
 * Handle script execution
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log("SOAR Feedback System - Mega Seed Script");
    console.log("");
    console.log("Usage:");
    console.log(
      "  tsx scripts/mega-seed.ts              Run the mega seed operation",
    );
    console.log("  tsx scripts/mega-seed.ts --help       Show this help");
    console.log("");
    console.log("This script will:");
    console.log("• Clear existing feedback data");
    console.log(
      "• Insert comprehensive Brazilian Portuguese feedback examples",
    );
    console.log(
      "• Run AI analysis on each entry for sentiment, topics, tags, etc.",
    );
    console.log("• Generate analytics summary of the seeded data");
    console.log("");
    console.log("Requirements:");
    console.log("• DATABASE_URL environment variable must be set");
    console.log("• OPENAI_API_KEY or GROQ_API_KEY for AI analysis");
    process.exit(0);
  }

  runMegaSeed().catch((error) => {
    console.error("💥 Mega seed script failed:", error);
    process.exit(1);
  });
}

export { runMegaSeed, seedData };
