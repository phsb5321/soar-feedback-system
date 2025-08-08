import { CSSProperties } from "react";

export interface LogoProps {
  /** Size variant of the logo */
  size?: "small" | "medium" | "large" | "xl";
  /** Additional CSS classes */
  className?: string;
  /** Custom styles */
  style?: CSSProperties;
  /** Whether to show the subtitle */
  showSubtitle?: boolean;
  /** Custom subtitle text */
  subtitle?: string;
  /** Whether to show the decorative line */
  showDecorationLine?: boolean;
  /** Color theme of the logo */
  theme?: "gradient" | "solid" | "white";
}

export function Logo({
  size = "large",
  className = "",
  style,
  showSubtitle = true,
  subtitle = "Sistema de Avaliação e Feedback",
  showDecorationLine = true,
  theme = "gradient",
}: LogoProps) {
  // Size variants with responsive classes
  const sizeClasses = {
    small: "text-lg sm:text-xl md:text-2xl",
    medium: "text-2xl sm:text-3xl md:text-4xl",
    large: "text-3xl sm:text-4xl md:text-5xl",
    xl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
  };

  const subtitleSizeClasses = {
    small: "text-xs sm:text-sm",
    medium: "text-sm sm:text-base",
    large: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
  };

  const decorationLineClasses = {
    small: "w-8 sm:w-12 h-0.5",
    medium: "w-12 sm:w-16 h-0.5",
    large: "w-16 sm:w-24 h-1",
    xl: "w-20 sm:w-32 h-1",
  };

  // Theme styles
  const getLogoStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      fontFamily: "var(--font-pacifico), cursive",
      fontWeight: "400",
      letterSpacing: "0.1em",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    };

    switch (theme) {
      case "gradient":
        return {
          ...baseStyles,
          background: "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "#1f2937", // Fallback color
        };
      case "white":
        return {
          ...baseStyles,
          color: "#ffffff",
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        };
      case "solid":
      default:
        return {
          ...baseStyles,
          color: "#1f2937",
        };
    }
  };

  const getSubtitleColor = () => {
    switch (theme) {
      case "white":
        return "text-white/80";
      case "gradient":
      case "solid":
      default:
        return "text-gray-200";
    }
  };

  return (
    <div className={`text-center ${className}`} style={style}>
      <h1
        className={`
          ${sizeClasses[size]}
          font-bold
          drop-shadow-lg
          mb-2 sm:mb-3
          transition-all
          duration-300
          ease-in-out
        `}
        style={getLogoStyles()}
      >
        SOAR
      </h1>

      {showSubtitle && (
        <p
          className={`
            ${subtitleSizeClasses[size]}
            ${getSubtitleColor()}
            font-medium
            tracking-wide
            opacity-80
            transition-opacity
            duration-300
          `}
        >
          {subtitle}
        </p>
      )}

      {showDecorationLine && (
        <div
          className={`
            ${decorationLineClasses[size]}
            bg-gradient-to-r
            from-blue-500
            to-purple-600
            rounded-full
            mx-auto
            mt-3 sm:mt-4
            opacity-60
            transition-all
            duration-300
          `}
        />
      )}
    </div>
  );
}
