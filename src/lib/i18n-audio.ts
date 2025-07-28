/**
 * Internationalization (i18n) system for SOAR Feedback System
 * Optimized for Brazilian Portuguese TTS with premium audio settings
 */

export interface AudioMessage {
  text: string;
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  speed: number;
  description: string;
  category:
    | "welcome"
    | "instruction"
    | "action"
    | "feedback"
    | "success"
    | "error";
}

export interface LanguageConfig {
  locale: string;
  name: string;
  audioMessages: Record<string, AudioMessage>;
}

/**
 * Brazilian Portuguese configuration with premium TTS optimization
 * Each message is crafted for natural pronunciation and emotional delivery
 */
export const PT_BR_CONFIG: LanguageConfig = {
  locale: "pt-BR",
  name: "Português Brasileiro",
  audioMessages: {
    welcome: {
      text: "Bem-vindos ao Sistema de Avaliação SOAR! Este sistema permite que vocês compartilhem suas experiências através de gravação de voz. É simples e fácil de usar.",
      voice: "nova",
      speed: 0.9,
      description: "Warm and welcoming introduction",
      category: "welcome",
    },
    recordingInstructions: {
      text: "Olá pessoal! Para começar, cliquem no botão abaixo para gravar o feedback de vocês. É só falar naturalmente.",
      voice: "nova",
      speed: 0.95,
      description: "Friendly recording instructions",
      category: "instruction",
    },
    startRecording: {
      text: "Perfeito! Agora podem falar tudo o que desejam compartilhar conosco. Fiquem à vontade para expressarem suas opiniões.",
      voice: "shimmer",
      speed: 0.9,
      description: "Encouraging start recording prompt",
      category: "action",
    },
    stopRecording: {
      text: "Ótimo! A gravação foi finalizada com sucesso. Por favor, aguardem alguns momentos enquanto processamos e transcrevemos o áudio de vocês.",
      voice: "alloy",
      speed: 1.0,
      description: "Professional recording completion status",
      category: "action",
    },
    csatWelcome: {
      text: "Agora vamos avaliar a experiência de vocês! Usando nosso sistema de feedback, escolham uma nota de zero a dez. Zero sendo muito ruim e dez sendo excelente.",
      voice: "nova",
      speed: 0.85,
      description: "Inviting evaluation request",
      category: "feedback",
    },
    submitSuccess: {
      text: "Muito obrigado mesmo! A avaliação de vocês foi enviada com sucesso. Sua opinião é muito importante para nós.",
      voice: "shimmer",
      speed: 0.9,
      description: "Grateful success confirmation",
      category: "success",
    },
    submitError: {
      text: "Ops! Infelizmente ocorreu um erro ao enviar o feedback. Por favor, tentem novamente em alguns instantes.",
      voice: "alloy",
      speed: 0.95,
      description: "Clear and helpful error message",
      category: "error",
    },
    successMessage: {
      text: "Parabéns e muito obrigado! O feedback de vocês foi enviado com sucesso. Agradecemos muito pela participação e contribuição valiosa!",
      voice: "shimmer",
      speed: 0.85,
      description: "Celebratory final message with gratitude",
      category: "success",
    },
  },
};

/**
 * English configuration for reference/fallback
 */
export const EN_US_CONFIG: LanguageConfig = {
  locale: "en-US",
  name: "English (US)",
  audioMessages: {
    welcome: {
      text: "Welcome to the SOAR Evaluation System! This system allows you to share your experiences through voice recording. It's simple and easy to use.",
      voice: "alloy",
      speed: 1.0,
      description: "Professional welcome message",
      category: "welcome",
    },
    recordingInstructions: {
      text: "Hello! To get started, click the button below to record your feedback. Just speak naturally.",
      voice: "alloy",
      speed: 1.0,
      description: "Clear recording instructions",
      category: "instruction",
    },
    startRecording: {
      text: "Perfect! Now you can share everything you'd like to tell us. Feel free to express your opinions.",
      voice: "nova",
      speed: 1.0,
      description: "Encouraging recording prompt",
      category: "action",
    },
    stopRecording: {
      text: "Great! The recording has been completed successfully. Please wait a few moments while we process and transcribe your audio.",
      voice: "alloy",
      speed: 1.0,
      description: "Professional status update",
      category: "action",
    },
    csatWelcome: {
      text: "Now let's evaluate your experience! Using our feedback system, please choose a rating from zero to ten. Zero being very poor and ten being excellent.",
      voice: "alloy",
      speed: 1.0,
      description: "Clear evaluation instructions",
      category: "feedback",
    },
    submitSuccess: {
      text: "Thank you very much! Your evaluation has been submitted successfully. Your opinion is very important to us.",
      voice: "nova",
      speed: 1.0,
      description: "Grateful success message",
      category: "success",
    },
    submitError: {
      text: "Oops! Unfortunately, an error occurred while submitting the feedback. Please try again in a few moments.",
      voice: "alloy",
      speed: 1.0,
      description: "Clear error message",
      category: "error",
    },
    successMessage: {
      text: "Congratulations and thank you! Your feedback has been submitted successfully. We greatly appreciate your participation and valuable contribution!",
      voice: "nova",
      speed: 1.0,
      description: "Celebratory final message",
      category: "success",
    },
  },
};

/**
 * Current language configuration (default: Brazilian Portuguese)
 */
export const CURRENT_LANGUAGE = PT_BR_CONFIG;

/**
 * Available languages
 */
export const AVAILABLE_LANGUAGES = {
  "pt-BR": PT_BR_CONFIG,
  "en-US": EN_US_CONFIG,
} as const;

export type SupportedLocale = keyof typeof AVAILABLE_LANGUAGES;
export type AudioMessageKey = keyof typeof CURRENT_LANGUAGE.audioMessages;

/**
 * Get audio message configuration for a specific key
 */
export function getAudioMessage(key: AudioMessageKey): AudioMessage {
  return CURRENT_LANGUAGE.audioMessages[key];
}

/**
 * Get all audio messages for the current language
 */
export function getAllAudioMessages(): Record<string, AudioMessage> {
  return CURRENT_LANGUAGE.audioMessages;
}

/**
 * Get audio URL for a message key
 */
export function getAudioUrl(key: AudioMessageKey): string {
  return `/audio/${key}.mp3`;
}

/**
 * Get messages by category
 */
export function getMessagesByCategory(
  category: AudioMessage["category"]
): Record<string, AudioMessage> {
  const messages: Record<string, AudioMessage> = {};

  for (const [key, message] of Object.entries(CURRENT_LANGUAGE.audioMessages)) {
    if (message.category === category) {
      messages[key] = message;
    }
  }

  return messages;
}

/**
 * Generate TTS payload for OpenAI API
 */
export function generateTTSPayload(key: AudioMessageKey) {
  const message = getAudioMessage(key);

  return {
    model: "tts-1-hd",
    input: message.text,
    voice: message.voice,
    speed: message.speed,
    response_format: "mp3",
  };
}
