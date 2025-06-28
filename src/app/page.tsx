"use client";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { Fira_Code, Pacifico } from "next/font/google";
import { useState } from "react";
import RecorderButton from "./RecorderButton";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });
const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "700"] });

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
  const [transcription, setTranscription] = useState("");
  const [transcribing, setTranscribing] = useState(false);

  const handleTranscribe = async (audioBlob: Blob) => {
    setTranscribing(true);
    const text = await transcribeAudio(audioBlob);
    setTranscription(text);
    setTranscribing(false);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      p={2}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 4,
          color: "#1976d2",
          letterSpacing: 2,
          textShadow: "2px 2px 8px #90caf9",
          fontFamily: pacifico.style.fontFamily,
        }}
      >
        SOAR
      </Typography>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <RecorderButton onTranscribe={handleTranscribe} />
        {transcribing && <CircularProgress color="primary" size={32} />}
        {transcription && !transcribing && (
          <Box mt={2} width="100%">
            <Typography
              variant="subtitle2"
              color="#1976d2"
              sx={{
                fontWeight: 700,
                mb: 1,
                letterSpacing: 1,
                fontFamily: firaCode.style.fontFamily,
              }}
            >
              TRANSCRIÇÃO
            </Typography>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                fontFamily: firaCode.style.fontFamily,
                background: "#f5f7fa",
                borderRadius: 2,
                p: 2,
                whiteSpace: "pre-line",
                fontSize: 18,
                boxShadow: "0 2px 8px #e3e3e3",
                textAlign: "left",
              }}
            >
              {transcription}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
