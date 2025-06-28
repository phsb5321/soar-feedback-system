import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "circle";
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  shape = "rounded",
  children,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "focus:outline-none transition-all duration-300 focus:ring-4 shadow-lg backdrop-blur-sm font-medium relative overflow-hidden";

  const shapeClasses = {
    rounded: "rounded-full border-2 border-white/20",
    circle:
      "rounded-full aspect-square flex items-center justify-center border-3 border-white/30",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white focus:ring-blue-200/50 shadow-blue-500/25",
    secondary:
      "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 text-white focus:ring-gray-200/50 shadow-gray-500/25",
    danger:
      "bg-gradient-to-br from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white focus:ring-red-200/50 shadow-red-500/25",
    success:
      "bg-gradient-to-br from-green-500 via-emerald-600 to-green-600 hover:from-green-600 hover:via-emerald-700 hover:to-green-700 text-white focus:ring-green-200/50 shadow-green-500/25",
  };

  const sizeClasses = {
    sm: shape === "circle" ? "w-12 h-12 text-sm" : "px-3 py-2 text-sm",
    md: shape === "circle" ? "w-16 h-16 text-base" : "px-4 py-3 text-base",
    lg: shape === "circle" ? "w-20 h-20 text-lg" : "px-6 py-4 text-lg",
  };

  const classes =
    `${baseClasses} ${shapeClasses[shape]} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? "Carregando..." : children}
      </div>
    </button>
  );
}
