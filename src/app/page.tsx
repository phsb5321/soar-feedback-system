"use client";
import { Text } from "@/components/atoms";
import { SimpleFeedbackForm } from "@/components/organisms";
import { Box } from "@mui/material";

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
              color: "#1f2937", // Fallback color
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
            Sistema de Avaliação e Feedback
          </Text>
          <div className="mt-3 sm:mt-4 w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto opacity-60" />
        </div>

        <SimpleFeedbackForm />

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
