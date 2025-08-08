"use client";
import { audioOverlayColors, semanticColors } from "@/lib/colorSystem";
import { useAudioStore } from "@/stores/audioStore";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * AudioBlockingOverlay Component
 *
 * Displays a full-screen overlay when protected audio is playing to prevent
 * user interactions until the audio completes. Provides visual feedback
 * to avoid user frustration.
 *
 * Features:
 * - Full-screen semi-transparent backdrop
 * - Loading spinner with audio message
 * - Blocks all user interactions
 * - Automatically disappears when audio ends
 * - Accessibility support with ARIA announcements
 * - Mobile-responsive design
 */
export function AudioBlockingOverlay() {
  const audioStore = useAudioStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleManualClose = () => {
    audioStore.stopProtectedAudio();
  };

  // Prevent scrolling when overlay is active
  useEffect(() => {
    if (audioStore.isProtectedPlaying) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [audioStore.isProtectedPlaying]);

  // Handle keyboard events to prevent interactions
  useEffect(() => {
    if (!audioStore.isProtectedPlaying) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Allow only Tab for accessibility navigation within the overlay
      if (event.key !== "Tab") {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [audioStore.isProtectedPlaying]);

  // Handle pointer events to prevent interactions
  useEffect(() => {
    if (!audioStore.isProtectedPlaying) return;

    const handlePointerEvent = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const events = ["click", "mousedown", "mouseup", "touchstart", "touchend"];
    events.forEach((eventType) => {
      document.addEventListener(eventType, handlePointerEvent, {
        capture: true,
      });
    });

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(eventType, handlePointerEvent, {
          capture: true,
        });
      });
    };
  }, [audioStore.isProtectedPlaying]);

  if (!audioStore.isProtectedPlaying) {
    return null;
  }

  const overlayContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{
        backgroundColor: audioOverlayColors.backdrop,
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.3s ease-out",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-overlay-title"
      aria-describedby="audio-overlay-description"
    >
      {/* Main content container */}
      <div
        className="rounded-2xl shadow-xl p-8 max-w-xl mx-auto text-center animate-slide-up"
        style={{
          backgroundColor: audioOverlayColors.container.background,
          border: `2px solid ${audioOverlayColors.container.border}`,
          boxShadow: `0 16px 32px -8px ${audioOverlayColors.container.shadow}, 0 0 0 1px rgba(59, 130, 246, 0.1)`,
        }}
      >
        {/* Manual close button */}
        <button
          onClick={handleManualClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${semanticColors.border.default}`,
          }}
          aria-label="Fechar áudio e continuar navegação"
          title="Clique para parar o áudio e continuar"
        >
          <svg
            className="w-4 h-4"
            style={{ color: semanticColors.text.primary }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Audio icon */}
        <div className="mb-6 flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: audioOverlayColors.icon.background,
              animation: "spin 4s linear infinite",
              boxShadow: "0 8px 16px rgba(59, 130, 246, 0.3)",
            }}
          >
            <svg
              className="w-8 h-8 drop-shadow-md"
              style={{ color: audioOverlayColors.icon.iconColor }}
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="mb-6 flex justify-center">
          <div
            className="w-8 h-8 border-2 border-t-2 rounded-full animate-spin"
            style={{
              borderColor: `${semanticColors.border.subtle}`,
              borderTopColor: audioOverlayColors.spinner,
              filter: "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2))",
            }}
          />
        </div>

        {/* Accessible title */}
        <h1
          id="audio-overlay-title"
          className="text-2xl font-bold mb-6 tracking-tight leading-tight"
          style={{
            color: audioOverlayColors.text.title,
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          🎧 Reproduzindo Áudio de Ajuda
        </h1>

        {/* Accessible description */}
        <div
          id="audio-overlay-description"
          className="text-base leading-relaxed space-y-4 font-medium"
        >
          <div
            className="py-3 px-4 rounded-lg border-2"
            style={{
              backgroundColor: audioOverlayColors.status.active.background,
              borderColor: audioOverlayColors.status.active.border,
              color: audioOverlayColors.status.active.text,
            }}
          >
            <span className="font-semibold">
              📢 Áudio de ajuda em reprodução
            </span>
          </div>

          <p
            className="text-base text-center font-medium"
            style={{ color: audioOverlayColors.text.primary }}
          >
            ⏸️ Aguarde o término para continuar navegando
          </p>

          <div
            className="py-3 px-4 rounded-lg border-2"
            style={{
              backgroundColor: audioOverlayColors.status.warning.background,
              borderColor: audioOverlayColors.status.warning.border,
              color: audioOverlayColors.status.warning.text,
            }}
          >
            <span className="font-semibold">
              ✋ Todas as interações estão bloqueadas
            </span>
          </div>

          <p
            className="text-sm text-center font-medium mt-2"
            style={{ color: audioOverlayColors.text.primary }}
          >
            💡 <strong>Dica:</strong> Clique no ✕ no canto superior direito para
            fechar
          </p>
        </div>

        {/* Pulsing indicator */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {[0, 300, 600].map((delay, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full shadow-sm animate-pulse"
                style={{
                  background: audioOverlayColors.indicators,
                  animationDelay: `${delay}ms`,
                  boxShadow: "0 0 8px rgba(59, 130, 246, 0.4)",
                }}
              />
            ))}
          </div>
        </div>

        {/* System info */}
        <div
          className="mt-6 text-center py-3 px-4 rounded-lg border"
          style={{
            backgroundColor: audioOverlayColors.status.info.background,
            borderColor: audioOverlayColors.status.info.border,
            color: audioOverlayColors.status.info.text,
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: audioOverlayColors.text.primary }}
          >
            🔊 Certifique-se de que o volume está ligado
          </p>
          <p
            className="text-xs mt-1 font-medium"
            style={{ color: audioOverlayColors.text.secondary }}
          >
            ⚡ Processamento em andamento...
          </p>
        </div>
      </div>

      {/* Enhanced screen reader announcement */}
      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
        role="status"
      >
        Atenção: Áudio de ajuda foi iniciado e está sendo reproduzido agora.
        Todas as interações da interface do usuário estão temporariamente
        bloqueadas por motivos de acessibilidade. Por favor, aguarde
        pacientemente o término completo da reprodução do áudio antes de
        continuar a navegação. O áudio terminará automaticamente em alguns
        segundos.
      </div>
    </div>
  );

  // Render to document body to ensure it's on top of everything
  return typeof window !== "undefined"
    ? createPortal(overlayContent, document.body)
    : null;
}
