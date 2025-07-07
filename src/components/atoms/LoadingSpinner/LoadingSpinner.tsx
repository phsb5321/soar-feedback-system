export interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

/**
 * Atomic component for loading spinner
 * Follows Single Responsibility Principle
 */
export function LoadingSpinner({
  size = "medium",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  const colorClasses = {
    primary: "border-blue-500",
    secondary: "border-gray-500",
    white: "border-white",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        border-2 ${colorClasses[color]} border-t-transparent 
        rounded-full animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading..."
    />
  );
}
