"use client";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Text } from "@/components/atoms/Text/Text";

export interface PostRecordingActionsProps {
  audioBlob: Blob;
  onReRecord: () => void;
  onSend: () => void;
  isSending?: boolean;
  className?: string;
}

export function PostRecordingActions({
  audioBlob,
  onReRecord,
  onSend,
  isSending = false,
  className = "",
}: PostRecordingActionsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cria a URL do blob apenas uma vez e limpa ao desmontar
  const audioUrl = useMemo(() => URL.createObjectURL(audioBlob), [audioBlob]);

  const playAudio = () => {
    setPlayCount((c) => c + 1); // Força o React a recriar o <audio>
    setIsPlaying(true);
  };

  // Quando o <audio> for montado, tente dar play
  const handleAudioRef = (el: HTMLAudioElement | null) => {
    audioRef.current = el;
    if (el && isPlaying) {
      el.currentTime = 0;
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((err) => {
          if (
            err &&
            err.name === "NotAllowedError" &&
            typeof window !== "undefined"
          ) {
            alert(
              "O navegador bloqueou a reprodução automática. Tente clicar novamente."
            );
          } else {
            console.error(err);
          }
        });
      }
    }
  };

  return (
    <div className={`flex flex-col gap-4 w-full ${className}`}>
      <Text
        variant="body"
        className="text-center font-semibold text-black"
      >
        O que você gostaria de fazer?
      </Text>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {/* Listen Again Button */}
        <Button
          variant="secondary"
          size="md"
          onClick={playAudio}
          className="flex items-center justify-center gap-2 px-6 py-3"
        >
          <Icon
            src={isPlaying ? "/pause.svg" : "/play.svg"}
            alt={isPlaying ? "Pausar" : "Ouvir"}
            size={18}
          />
          <span>{isPlaying ? "Pausar" : "Ouvir Novamente"}</span>
        </Button>

        {/* Re-record Button */}
        <Button
          variant="secondary"
          size="md"
          onClick={onReRecord}
          disabled={isSending}
          className="flex items-center justify-center gap-2 px-6 py-3"
        >
          <Icon src="/refresh.svg" alt="Regravar" size={18} />
          <span>Regravar</span>
        </Button>

        {/* Send Button */}
        <Button
          variant="primary"
          size="md"
          onClick={onSend}
          disabled={isSending}
          className="flex items-center justify-center gap-2 px-6 py-3"
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Icon src="/send.svg" alt="Enviar" size={18} />
              <span>Enviar Feedback</span>
            </>
          )}
        </Button>
      </div>

      {/* Hidden audio element (agora visível para debug) */}
      {isPlaying && (
        <audio
          key={playCount}
          ref={handleAudioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          controls
          autoPlay
          style={{ width: 300, height: 30, position: "relative", left: 0 }}
        />
      )}
    </div>
  );
} 