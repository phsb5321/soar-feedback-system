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
    "focus:outline-none transition-all duration-300 focus:ring-4 shadow-lg backdrop-blur-sm font-medium relative overflow-hidden touch-manipulation select-none";

  const shapeClasses = {
    rounded: "rounded-full border-2 border-white/20",
    circle:
      "rounded-full aspect-square flex items-center justify-center border-3 border-white/30",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 active:from-blue-700 active:via-blue-800 active:to-purple-800 text-white focus:ring-blue-200/50 shadow-blue-500/25",
    secondary:
      "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 active:from-gray-600 active:via-gray-700 active:to-gray-800 text-white focus:ring-gray-200/50 shadow-gray-500/25",
    danger:
      "bg-gradient-to-br from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 active:from-red-700 active:via-red-800 active:to-pink-800 text-white focus:ring-red-200/50 shadow-red-500/25",
    success:
      "bg-gradient-to-br from-green-500 via-emerald-600 to-green-600 hover:from-green-600 hover:via-emerald-700 hover:to-green-700 active:from-green-700 active:via-emerald-800 active:to-green-800 text-white focus:ring-green-200/50 shadow-green-500/25",
  };

  // Mobile-optimized sizing with minimum 44px touch targets
  const sizeClasses = {
    sm:
      shape === "circle"
        ? "w-12 h-12 min-w-[44px] min-h-[44px] text-sm sm:w-12 sm:h-12"
        : "px-3 py-2 min-h-[44px] text-sm sm:px-3 sm:py-2",
    md:
      shape === "circle"
        ? "w-16 h-16 min-w-[48px] min-h-[48px] text-base sm:w-16 sm:h-16 md:w-18 md:h-18"
        : "px-4 py-3 min-h-[48px] text-base sm:px-4 sm:py-3",
    lg:
      shape === "circle"
        ? "w-20 h-20 min-w-[56px] min-h-[56px] text-lg sm:w-20 sm:h-20 md:w-24 md:h-24"
        : "px-6 py-4 min-h-[56px] text-lg sm:px-6 sm:py-4",
  };

  const classes =
    `${baseClasses} ${shapeClasses[shape]} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 active:opacity-75 transition-opacity duration-300" />
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? "Carregando..." : children}
      </div>
    </button>
  );
}
