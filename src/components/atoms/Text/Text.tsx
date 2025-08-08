import { CSSProperties, ReactNode } from "react";

export interface TextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "code";
  color?: "primary" | "secondary" | "error" | "success" | "muted" | "disabled";
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  style?: CSSProperties;
}

export function Text({
  children,
  variant = "body",
  color = "primary",
  className = "",
  as,
  style,
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

  // Force dark text colors for better contrast
  const getDarkTextColor = () => {
    const darkColors = {
      primary: "#1f2937", // gray-800 - very dark
      secondary: "#374151", // gray-700 - dark
      error: "#dc2626", // red-600 - dark red
      success: "#059669", // emerald-600 - dark green
      muted: "#4b5563", // gray-600 - medium dark
      disabled: "#6b7280", // gray-500 - lighter but still readable
    };
    return darkColors[color];
  };

  // Always use dark colors for maximum contrast
  const textColor = getDarkTextColor();

  const contrastStyle: CSSProperties = {
    color: textColor,
    fontWeight: color === "primary" ? "600" : "500", // Make primary text bolder
  };

  // Determine the component to render
  const getComponent = () => {
    if (as) return as;
    if (variant === "h1" || variant === "h2" || variant === "h3") {
      return variant as "h1" | "h2" | "h3";
    }
    return "p";
  };

  const Component = getComponent();
  const classes = `${variantClasses[variant]} ${className}`.trim();

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
