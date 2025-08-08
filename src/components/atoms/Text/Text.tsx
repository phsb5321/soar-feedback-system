import { CSSProperties, ReactNode } from "react";
import { useContrast } from "@/hooks/useContrast";

export interface TextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "code";
  color?: "primary" | "secondary" | "error" | "success" | "muted" | "disabled";
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  style?: CSSProperties;
  contrastAware?: boolean;
  backgroundColor?: string;
}

export function Text({
  children,
  variant = "body",
  color = "primary",
  className = "",
  as,
  style,
  contrastAware = true,
  backgroundColor,
}: TextProps) {
  // Responsive typography with mobile-first approach
  const variantClasses = {
    h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight sm:leading-tight",
    h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight sm:leading-tight",
    h3: "text-lg sm:text-xl md:text-2xl font-semibold leading-snug sm:leading-snug",
    body: "text-sm sm:text-base md:text-lg leading-relaxed",
    caption: "text-xs sm:text-sm leading-normal",
    code: "font-mono text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded leading-normal",
  };

  const contrast = useContrast(backgroundColor);

  // Use contrast-aware colors if enabled
  const getTextColor = () => {
    if (!contrastAware) {
      // Fallback to original classes
      const colorClasses = {
        primary: "text-gray-800 dark:text-gray-100",
        secondary: "text-gray-600 dark:text-gray-300",
        error: "text-red-700 dark:text-red-400",
        success: "text-green-700 dark:text-green-400",
        muted: "text-gray-500 dark:text-gray-400",
        disabled: "text-gray-400 dark:text-gray-500",
      };
      return colorClasses[color];
    }

    // Use contrast-aware colors - return empty string to use inline styles
    return "";
  };

  const textColorClass = getTextColor();
  const contrastStyle =
    contrastAware && !textColorClass
      ? {
          color: (() => {
            switch (color) {
              case "primary":
                return contrast.textColor;
              case "secondary":
                return contrast.secondaryTextColor;
              case "error":
                return contrast.adjustColor("#dc2626");
              case "success":
                return contrast.adjustColor("#15803d");
              case "muted":
                return contrast.mutedTextColor;
              case "disabled":
                return contrast.palette.disabled;
              default:
                return contrast.textColor;
            }
          })(),
        }
      : {};

  // Determine the component to render
  const getComponent = () => {
    if (as) return as;
    if (variant === "h1" || variant === "h2" || variant === "h3") {
      return variant as "h1" | "h2" | "h3";
    }
    return "p";
  };

  const Component = getComponent();
  const classes = contrastAware
    ? `${variantClasses[variant]} ${className}`.trim()
    : `${variantClasses[variant]} ${textColorClass} ${className}`.trim();

  const combinedStyle: CSSProperties = {
    ...contrastStyle,
    ...style,
  };

  return (
    <Component className={classes} style={combinedStyle}>
      {children}
    </Component>
  );
}
