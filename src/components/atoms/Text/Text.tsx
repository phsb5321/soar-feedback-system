import { ReactNode } from "react";

export interface TextProps {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "code";
  color?: "primary" | "secondary" | "error" | "success";
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

export function Text({
  children,
  variant = "body",
  color = "primary",
  className = "",
  as,
}: TextProps) {
  const variantClasses = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-xl font-semibold",
    body: "text-base",
    caption: "text-sm",
    code: "font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded",
  };

  const colorClasses = {
    primary: "text-gray-900 dark:text-gray-100",
    secondary: "text-gray-600 dark:text-gray-400",
    error: "text-red-600 dark:text-red-400",
    success: "text-green-600 dark:text-green-400",
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
  const classes =
    `${variantClasses[variant]} ${colorClasses[color]} ${className}`.trim();

  return <Component className={classes}>{children}</Component>;
}
