import { Icon } from "@/components/atoms/Icon/Icon";
import { Text } from "@/components/atoms/Text/Text";

export interface TranscriptionDisplaySectionProps {
  transcription: string;
  className?: string;
}

/**
 * Molecule component for displaying transcription
 * Follows Single Responsibility Principle
 */
export function TranscriptionDisplaySection({
  transcription,
  className = "",
}: TranscriptionDisplaySectionProps) {
  if (!transcription) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <Text variant="h3" className="font-semibold" style={{ color: "#1f2937" }}>
        2. Transcrição do seu feedback
      </Text>

      <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
        {/* Quote icon */}
        <div className="absolute top-3 left-3 w-6 h-6 text-blue-400 opacity-60">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
          </svg>
        </div>

        {/* Transcription text */}
        <div className="ml-8">
          <Text
            variant="body"
            className="text-lg leading-relaxed font-medium italic"
            style={{ color: "#374151" }}
          >
            {transcription}
          </Text>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-3 right-3 w-4 h-4 bg-blue-300 rounded-full opacity-30"></div>
      </div>

      {/* Helper text */}
      <div
        className="flex items-center space-x-2 text-sm"
        style={{ color: "#6b7280" }}
      >
        <Icon src="/check-circle.svg" alt="Verificado" size={16} />
        <Text variant="caption">Transcrição gerada automaticamente por IA</Text>
      </div>
    </div>
  );
}
