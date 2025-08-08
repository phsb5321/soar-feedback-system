"use client";
import { HelpButton, Logo, Text } from "@/components/atoms";
import { SimpleFeedbackForm } from "@/components/organisms";
import { AudioProvider, useAudioContext } from "@/contexts/AudioContext";
import { Box } from "@mui/material";

function HomeContent() {
  const { playProtectedPageAudio } = useAudioContext();

  const handleWelcomeHelp = () => {
    playProtectedPageAudio("welcome").catch(() => {
      console.info("Welcome audio blocked, proceeding without audio feedback");
    });
  };

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
        <div className="mb-6 sm:mb-8 md:mb-10 relative">
          <Logo
            size="large"
            showSubtitle={true}
            subtitle="Sistema de Avaliação e Feedback"
            showDecorationLine={true}
            theme="gradient"
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

export default function Home() {
  return (
    <AudioProvider pageId="home">
      <HomeContent />
    </AudioProvider>
  );
}
