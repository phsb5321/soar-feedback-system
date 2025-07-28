"use client";
import { Button } from "@/components/atoms/Button/Button";
import { HelpButton } from "@/components/atoms/HelpButton/HelpButton";
import { Icon } from "@/components/atoms/Icon/Icon";
import { LoadingSpinner } from "@/components/atoms/LoadingSpinner/LoadingSpinner";
import { Logo } from "@/components/atoms/Logo/Logo";
import { Text } from "@/components/atoms/Text/Text";
import { AudioProvider, useAudioContext } from "@/contexts/AudioContext";
import { Box, Chip, Paper, Rating } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface CSATData {
  transcription: string;
  audioUrl?: string;
}

function CSATContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { playPageAudio } = useAudioContext();
  const [npsScore, setNpsScore] = useState<number | null>(null);
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
    if (score <= 2) return "Muito Difícil";
    if (score <= 4) return "Difícil";
    if (score <= 6) return "Neutro";
    if (score <= 8) return "Fácil";
    return "Muito Fácil";
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
    // No custom TTS - only use pre-recorded audio files

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcription: csatData.transcription,
          npsScore,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        playPageAudio("submitSuccess", 8);
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      playPageAudio("submitError", 8);
      alert("Erro ao enviar feedback. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (_: unknown, newValue: number | null) => {
    setNpsScore(newValue);
    // No custom TTS - only visual feedback for rating selection
  };

  const handleCSATWelcomeHelp = () => {
    playPageAudio("csatWelcome", 7).catch(() => {
      console.info(
        "CSAT welcome audio blocked, proceeding without audio feedback"
      );
    });
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
        <div className="mb-6 sm:mb-8 md:mb-10">
          <Logo
            size="large"
            showSubtitle={true}
            subtitle="Avaliação e Feedback"
            showDecorationLine={false}
            theme="gradient"
          />
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
              <div className="text-center relative">
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

                {/* Help button for CSAT instructions */}
                <div className="absolute top-0 right-0">
                  <HelpButton
                    ariaLabel="Ouvir instruções sobre a avaliação"
                    tooltip="Clique para ouvir instruções sobre como avaliar"
                    onHelp={handleCSATWelcomeHelp}
                    icon="help"
                    size="small"
                    color="info"
                  />
                </div>
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
                <div className="text-center space-y-2">
                  <Text
                    variant="h3"
                    className="font-semibold"
                    style={{ color: "#1f2937" }}
                  >
                    ⭐ Avalie nossa experiência
                  </Text>
                  <Text variant="body" style={{ color: "#6b7280" }}>
                    Como foi usar nosso sistema de feedback?
                  </Text>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Rating
                      name="nps-rating"
                      value={npsScore}
                      onChange={handleRatingChange}
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
                        0 = Muito Difícil de Usar | 10 = Muito Fácil de Usar
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  variant="secondary"
                  onClick={handleGoBack}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2"
                  style={{ color: "#6b7280", borderColor: "#d1d5db" }}
                >
                  <span className="text-xl">⬅️</span>
                  <span>Voltar</span>
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting || npsScore === null}
                  className="w-full sm:flex-1 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" color="white" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">📤</span>
                      <span>Enviar</span>
                    </>
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
    <AudioProvider pageId="csat">
      <Suspense
        fallback={
          <main className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" color="primary" />
          </main>
        }
      >
        <CSATContent />
      </Suspense>
    </AudioProvider>
  );
}
