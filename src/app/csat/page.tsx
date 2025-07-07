"use client";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner/LoadingSpinner";
import { Text } from "@/components/atoms/Text/Text";
import { Box, Chip, Paper, Rating, TextField } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface CSATData {
  transcription: string;
  audioUrl?: string;
}

function CSATContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [additionalComment, setAdditionalComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [csatData, setCsatData] = useState<CSATData | null>(null);

  useEffect(() => {
    const transcription = searchParams.get("transcription");
    const audioUrl = searchParams.get("audioUrl");

    if (!transcription) {
      router.push("/");
      return;
    }

    setCsatData({
      transcription,
      audioUrl: audioUrl || undefined,
    });
  }, [searchParams, router]);

  const getNPSLabel = (score: number): string => {
    if (score <= 2) return "Muito Insatisfeito";
    if (score <= 4) return "Insatisfeito";
    if (score <= 6) return "Neutro";
    if (score <= 8) return "Satisfeito";
    return "Muito Satisfeito";
  };

  const getNPSColor = (score: number): string => {
    if (score <= 2) return "#ef4444";
    if (score <= 4) return "#f97316";
    if (score <= 6) return "#eab308";
    if (score <= 8) return "#3b82f6";
    return "#22c55e";
  };

  const handleSubmit = async () => {
    if (!csatData) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcription: csatData.transcription,
          npsScore,
          additionalComment,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Erro ao enviar feedback. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const handleNewFeedback = () => {
    router.push("/");
  };

  if (!csatData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" color="primary" />
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-500 px-4 py-8 sm:px-6 lg:px-8">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          maxWidth={{ xs: "100%", sm: 600, md: 800 }}
          mx="auto"
          px={{ xs: 2, sm: 4 }}
          className="relative z-10"
        >
          <Paper
            elevation={20}
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              borderRadius: { xs: 6, sm: 8 },
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 25px 80px 0 rgba(34, 197, 94, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.15)",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
            }}
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Icon
                  src="/send.svg"
                  alt="Sucesso"
                  size={32}
                  className="text-green-600"
                />
              </div>
              <Text
                variant="h3"
                className="font-bold"
                style={{ color: "#16a34a" }}
              >
                Feedback Enviado com Sucesso!
              </Text>
              <Text
                variant="body"
                className="max-w-md"
                style={{ color: "#6b7280" }}
              >
                Obrigado por sua participação. Sua opinião é muito importante
                para nós.
              </Text>
              <Button
                variant="primary"
                onClick={handleNewFeedback}
                className="mt-8"
              >
                Enviar Novo Feedback
              </Button>
            </div>
          </Paper>
        </Box>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-colors duration-500 px-4 py-8 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        maxWidth={{ xs: "100%", sm: 600, md: 800 }}
        mx="auto"
        px={{ xs: 2, sm: 4 }}
        className="relative z-10"
      >
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1
            className="mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg tracking-widest"
            style={{
              background:
                "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "#1f2937",
            }}
          >
            SOAR
          </h1>
          <Text
            variant="body"
            color="secondary"
            className="text-lg sm:text-xl font-medium tracking-wide opacity-80"
            style={{ color: "#6b7280" }}
          >
            Avaliação e Feedback
          </Text>
        </div>

        <div className="w-full max-w-2xl mx-auto">
          <Paper
            elevation={20}
            sx={{
              p: { xs: 4, sm: 6, md: 8 },
              borderRadius: { xs: 6, sm: 8 },
              minHeight: "500px",
              boxShadow:
                "0 25px 80px 0 rgba(59, 130, 246, 0.2), 0 12px 40px 0 rgba(0, 0, 0, 0.15)",
              background: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: { xs: "3px", sm: "5px" },
                background:
                  "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B)",
              },
            }}
          >
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <Text
                  variant="h3"
                  className="font-bold mb-2"
                  style={{ color: "#1f2937" }}
                >
                  Avalie sua Experiência
                </Text>
                <Text variant="body" style={{ color: "#6b7280" }}>
                  Sua opinião é muito importante para nós
                </Text>
              </div>

              {/* Transcription Summary */}
              <div className="space-y-4">
                <Text
                  variant="h3"
                  className="font-semibold"
                  style={{ color: "#1f2937" }}
                >
                  Seu Feedback:
                </Text>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <Text
                    variant="body"
                    className="italic"
                    style={{ color: "#374151" }}
                  >
                    &ldquo;{csatData.transcription}&rdquo;
                  </Text>
                </div>
              </div>

              {/* NPS Rating Section */}
              <div className="space-y-6">
                <Text
                  variant="h3"
                  className="font-semibold text-center"
                  style={{ color: "#1f2937" }}
                >
                  Como você avaliaria sua experiência?
                </Text>

                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Rating
                      name="nps-rating"
                      value={npsScore}
                      onChange={(_, newValue) => setNpsScore(newValue)}
                      max={10}
                      size="large"
                      sx={{
                        "& .MuiRating-iconEmpty": {
                          color: "#d1d5db",
                        },
                        "& .MuiRating-iconFilled": {
                          color: npsScore ? getNPSColor(npsScore) : "#d1d5db",
                        },
                        "& .MuiRating-iconHover": {
                          color: "#3b82f6",
                        },
                      }}
                    />
                    <div className="text-center">
                      <Text variant="caption" style={{ color: "#6b7280" }}>
                        0 = Muito Insatisfeito | 10 = Muito Satisfeito
                      </Text>
                      {npsScore !== null && (
                        <div className="mt-2">
                          <Chip
                            label={`${npsScore}/10 - ${getNPSLabel(npsScore)}`}
                            sx={{
                              backgroundColor: getNPSColor(npsScore),
                              color: "white",
                              fontWeight: "bold",
                            }}
                            size="small"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Comment Section */}
              <div className="space-y-4">
                <Text
                  variant="h3"
                  className="font-semibold"
                  style={{ color: "#1f2937" }}
                >
                  Comentário adicional (opcional)
                </Text>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Deixe um comentário adicional sobre sua experiência..."
                  value={additionalComment}
                  onChange={(e) => setAdditionalComment(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "rgba(249, 250, 251, 0.8)",
                    },
                    "& .MuiInputBase-input": {
                      color: "#1f2937",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6b7280",
                    },
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="secondary"
                  onClick={handleGoBack}
                  className="w-full sm:w-auto"
                  style={{ color: "#6b7280", borderColor: "#d1d5db" }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon src="/arrow-left.svg" alt="Voltar" size={20} />
                    <span>Voltar</span>
                  </div>
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <LoadingSpinner size="small" color="white" />
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Icon src="/send.svg" alt="Enviar" size={20} />
                      <span>Enviar Avaliação</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </Paper>
        </div>
      </Box>
    </main>
  );
}

export default function CSATPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="large" color="primary" />
        </main>
      }
    >
      <CSATContent />
    </Suspense>
  );
}
