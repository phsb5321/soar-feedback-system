"use client";
import { Text } from "@/components/atoms";
import { AudioTranscriber } from "@/components/organisms";
import { Box, Paper } from "@mui/material";

async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio.webm");
  const res = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) return "Erro ao transcrever áudio.";
  const data = await res.json();
  return data.text || "Sem resultado.";
}

export default function Home() {
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
        maxWidth={{ xs: "100%", sm: 500, md: 700 }}
        mx="auto"
        px={{ xs: 2, sm: 4 }}
        className="relative z-10"
      >
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1 className="mb-2 sm:mb-3 text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg tracking-widest font-pacifico">
            SOAR
          </h1>
          <Text
            variant="body"
            color="secondary"
            className="text-lg sm:text-xl font-medium tracking-wide opacity-80"
          >
            Sistema de Transcrição de Áudio
          </Text>
          <div className="mt-3 sm:mt-4 w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto opacity-60" />
        </div>

        <Paper
          elevation={20}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: { xs: 6, sm: 8 },
            minWidth: { xs: "100%", sm: 350, md: 400 },
            width: "100%",
            maxWidth: { xs: "100%", sm: 500, md: 600 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: { xs: 3, sm: 4, md: 5 },
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
          <div className="w-full">
            <AudioTranscriber onTranscribe={transcribeAudio} />
          </div>

          <div className="mt-2 text-center">
            <Text
              variant="caption"
              color="secondary"
              className="text-xs sm:text-sm opacity-70 font-medium px-2"
            >
              Clique no botão para começar a gravar seu áudio
            </Text>
          </div>
        </Paper>

        <div className="mt-6 sm:mt-8 text-center space-y-2">
          <Text
            variant="caption"
            color="secondary"
            className="text-xs sm:text-sm opacity-60 font-medium"
          >
            Powered by AI • Seguro e Privado
          </Text>
          <div className="flex items-center justify-center gap-2 opacity-40">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <Text variant="caption" color="secondary" className="text-xs">
              Sistema Online
            </Text>
          </div>
        </div>
      </Box>
    </main>
  );
}
