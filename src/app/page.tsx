"use client";
import { HelpButton, Logo, Text } from "@/components/atoms";
import { SimpleFeedbackForm } from "@/components/organisms";
import { AudioProvider, useAudioContext } from "@/contexts/AudioContext";
import {
  SmartBackground,
  useContrastContext,
} from "@/components/providers/ContrastProvider";
import { Box } from "@mui/material";

function HomeContent() {
  const { playProtectedPageAudio } = useAudioContext();
  const { colors, isDarkMode } = useContrastContext();

  const handleWelcomeHelp = () => {
    playProtectedPageAudio("welcome").catch(() => {
      console.info("Welcome audio blocked, proceeding without audio feedback");
    });
  };

  return (
    <SmartBackground
      contentType="primary"
      intensity="subtle"
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500 px-4 py-8 sm:px-6 lg:px-8"
      style={{
        background: isDarkMode
          ? `linear-gradient(135deg, ${colors.background} 0%, #1e3a8a 50%, #581c87 100%)`
          : `linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%)`,
      }}
      as="main"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(colors.primary)}' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
        <div className="mb-6 sm:mb-8 md:mb-10 relative">
          <Logo
            size="large"
            showSubtitle={true}
            subtitle="Sistema de Avaliação e Feedback"
            showDecorationLine={true}
            theme="white"
          />

          {/* Help button for welcome/instructions */}
          <div className="absolute -top-2 -right-2">
            <HelpButton
              ariaLabel="Ouvir explicação sobre o sistema SOAR"
              tooltip="Clique para ouvir uma explicação sobre como usar o sistema"
              onHelp={handleWelcomeHelp}
              icon="info"
              size="medium"
              color="primary"
            />
          </div>
        </div>

        <SimpleFeedbackForm />

        <div className="mt-6 sm:mt-8 text-center space-y-2">
          <Text
            variant="caption"
            color="secondary"
            className="text-xs sm:text-sm font-medium"
            style={{ color: "#e5e7eb", fontWeight: "500" }}
          >
            Powered by AI • Seguro e Privado
          </Text>
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.success }}
            />
            <Text
              variant="caption"
              color="secondary"
              className="text-xs"
              style={{ color: "#e5e7eb", fontWeight: "500" }}
            >
              Sistema Online
            </Text>
          </div>
        </div>
      </Box>
    </SmartBackground>
  );
}

export default function Home() {
  return (
    <AudioProvider pageId="home">
      <HomeContent />
    </AudioProvider>
  );
}
