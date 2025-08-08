import { Icon } from "@/components/atoms/Icon/Icon";
import { useProtectedAudio } from "@/hooks/useProtectedAudio";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

export interface HelpButtonProps {
  /** Aria label for accessibility */
  ariaLabel: string;
  /** Tooltip text to show on hover */
  tooltip: string;
  /** Function to call when help button is clicked */
  onHelp: () => void;
  /** Size of the help button */
  size?: "small" | "medium" | "large";
  /** Color theme of the help button */
  color?: "primary" | "secondary" | "info";
  /** Icon to use - defaults to help icon */
  icon?: "help" | "info" | "question" | "microphone" | "speech";
  /** Additional CSS classes */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * Atom component for accessible help buttons that trigger audio explanations
 * Follows accessibility best practices with ARIA labels and keyboard support
 */
export function HelpButton({
  ariaLabel,
  tooltip,
  onHelp,
  size = "medium",
  color = "info",
  icon = "help",
  className = "",
  disabled = false,
}: HelpButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { isProtectedPlaying } = useProtectedAudio();

  // Disable button when protected audio is playing or explicitly disabled
  const isDisabled = disabled || isProtectedPlaying;

  const getIconSrc = () => {
    switch (icon) {
      case "microphone":
        return "/microphone-help.svg";
      case "speech":
        return "/speech-help.svg";
      case "question":
        return "/help.svg";
      case "info":
        return "/info.svg";
      case "help":
      default:
        return "/help.svg";
    }
  };

  const getSizeProps = () => {
    switch (size) {
      case "small":
        return { buttonSize: "small" as const, iconSize: 16 };
      case "large":
        return { buttonSize: "large" as const, iconSize: 28 };
      case "medium":
      default:
        return { buttonSize: "medium" as const, iconSize: 20 };
    }
  };

  const getColorProps = () => {
    switch (color) {
      case "primary":
        return {
          color: "primary" as const,
          sx: {
            color: "#3b82f6",
            "&:hover": { backgroundColor: "rgba(59, 130, 246, 0.1)" },
          },
        };
      case "secondary":
        return {
          color: "secondary" as const,
          sx: {
            color: "#6b7280",
            "&:hover": { backgroundColor: "rgba(107, 114, 128, 0.1)" },
          },
        };
      case "info":
      default:
        return {
          color: "info" as const,
          sx: {
            color: "#0ea5e9",
            "&:hover": { backgroundColor: "rgba(14, 165, 233, 0.1)" },
          },
        };
    }
  };

  const { buttonSize, iconSize } = getSizeProps();
  const colorProps = getColorProps();

  const handleClick = () => {
    if (!isDisabled) {
      setIsPressed(true);
      onHelp();
      // Reset pressed state after a short delay for visual feedback
      setTimeout(() => setIsPressed(false), 150);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === "Enter" || event.key === " ") && !isDisabled) {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Tooltip
      title={isProtectedPlaying ? "Aguarde o áudio terminar..." : tooltip}
      arrow
      placement="top"
    >
      <span>
        <IconButton
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          size={buttonSize}
          aria-label={ariaLabel}
          className={`transition-all duration-150 ${
            isPressed ? "scale-95" : "scale-100"
          } ${className}`}
          sx={{
            ...colorProps.sx,
            "&:focus": {
              outline: "2px solid #3b82f6",
              outlineOffset: "2px",
            },
            "&.Mui-disabled": {
              color: "#d1d5db",
              opacity: isProtectedPlaying ? 0.5 : 0.3,
            },
          }}
        >
          <Icon src={getIconSrc()} alt="" size={iconSize} aria-hidden="true" />
        </IconButton>
      </span>
    </Tooltip>
  );
}
