import Color from "color";
import chroma from "chroma-js";

/**
 * WCAG Contrast Ratios
 * AA: 4.5:1 for normal text, 3:1 for large text
 * AAA: 7:1 for normal text, 4.5:1 for large text
 */
export const CONTRAST_STANDARDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

export type ContrastLevel = "AA" | "AAA";
export type TextSize = "normal" | "large";

/**
 * Color palette with semantic meanings
 */
export const COLOR_PALETTE = {
  // Base colors
  white: "#ffffff",
  black: "#000000",

  // Gray scale
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Brand colors
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Semantic colors
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
} as const;

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(
  foreground: string,
  background: string,
): number {
  try {
    const fg = Color(foreground);
    const bg = Color(background);
    return fg.contrast(bg);
  } catch (error) {
    console.warn("Error calculating contrast ratio:", error);
    return 1; // Worst case scenario
  }
}

/**
 * Check if contrast meets WCAG standards
 */
export function meetsContrastStandard(
  foreground: string,
  background: string,
  level: ContrastLevel = "AA",
  textSize: TextSize = "normal",
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const standard =
    level === "AA"
      ? textSize === "normal"
        ? CONTRAST_STANDARDS.AA_NORMAL
        : CONTRAST_STANDARDS.AA_LARGE
      : textSize === "normal"
        ? CONTRAST_STANDARDS.AAA_NORMAL
        : CONTRAST_STANDARDS.AAA_LARGE;

  return ratio >= standard;
}

/**
 * Find the best text color (black or white) for a given background
 */
export function getBestTextColor(
  backgroundColor: string,
  level: ContrastLevel = "AA",
  textSize: TextSize = "normal",
): string {
  const whiteContrast = getContrastRatio("#ffffff", backgroundColor);
  const blackContrast = getContrastRatio("#000000", backgroundColor);

  const standard =
    level === "AA"
      ? textSize === "normal"
        ? CONTRAST_STANDARDS.AA_NORMAL
        : CONTRAST_STANDARDS.AA_LARGE
      : textSize === "normal"
        ? CONTRAST_STANDARDS.AAA_NORMAL
        : CONTRAST_STANDARDS.AAA_LARGE;

  // If both meet the standard, prefer the one with higher contrast
  if (whiteContrast >= standard && blackContrast >= standard) {
    return whiteContrast > blackContrast ? "#ffffff" : "#000000";
  }

  // If only one meets the standard, use that one
  if (whiteContrast >= standard) return "#ffffff";
  if (blackContrast >= standard) return "#000000";

  // If neither meets the standard, use the one with higher contrast
  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}

/**
 * Adjust color lightness to meet contrast requirements
 */
export function adjustForContrast(
  foregroundColor: string,
  backgroundColor: string,
  level: ContrastLevel = "AA",
  textSize: TextSize = "normal",
): string {
  const targetRatio =
    level === "AA"
      ? textSize === "normal"
        ? CONTRAST_STANDARDS.AA_NORMAL
        : CONTRAST_STANDARDS.AA_LARGE
      : textSize === "normal"
        ? CONTRAST_STANDARDS.AAA_NORMAL
        : CONTRAST_STANDARDS.AAA_LARGE;

  try {
    const fg = chroma(foregroundColor);
    const bg = chroma(backgroundColor);

    // Check if current contrast is already sufficient
    if (getContrastRatio(foregroundColor, backgroundColor) >= targetRatio) {
      return foregroundColor;
    }

    // Try making the foreground darker or lighter
    let adjustedColor = fg;
    let currentRatio = getContrastRatio(adjustedColor.hex(), backgroundColor);

    // Determine if we should go darker or lighter
    const shouldDarken =
      chroma.contrast(fg.darken(), bg) > chroma.contrast(fg.brighten(), bg);

    let steps = 0;
    const maxSteps = 50;

    while (currentRatio < targetRatio && steps < maxSteps) {
      try {
        adjustedColor = shouldDarken
          ? adjustedColor.darken(0.1)
          : adjustedColor.brighten(0.1);
        currentRatio = getContrastRatio(adjustedColor.hex(), backgroundColor);
        steps++;
      } catch {
        break;
      }
    }

    return adjustedColor.hex();
  } catch (error) {
    console.warn("Error adjusting color for contrast:", error);
    return getBestTextColor(backgroundColor, level, textSize);
  }
}

/**
 * Generate a color palette that maintains proper contrast
 */
export function generateContrastPalette(
  baseColor: string,
  backgroundColor: string = "#ffffff",
) {
  try {
    const base = chroma(baseColor);

    return {
      primary: adjustForContrast(base.hex(), backgroundColor, "AA", "normal"),
      secondary: adjustForContrast(
        base.alpha(0.8).hex(),
        backgroundColor,
        "AA",
        "normal",
      ),
      muted: adjustForContrast(
        base.alpha(0.6).hex(),
        backgroundColor,
        "AA",
        "large",
      ),
      disabled: adjustForContrast(
        base.alpha(0.4).hex(),
        backgroundColor,
        "AA",
        "large",
      ),
      light: base.alpha(0.1).hex(),
      dark: adjustForContrast(base.darken(2).hex(), "#ffffff", "AA", "normal"),
    };
  } catch (error) {
    console.warn("Error generating contrast palette:", error);
    return {
      primary: "#1f2937",
      secondary: "#374151",
      muted: "#6b7280",
      disabled: "#9ca3af",
      light: "#f3f4f6",
      dark: "#111827",
    };
  }
}

/**
 * Smart background renderer that chooses colors based on content
 */
export function getSmartBackground(
  contentType:
    | "neutral"
    | "success"
    | "error"
    | "warning"
    | "info"
    | "primary" = "neutral",
  intensity: "subtle" | "medium" | "strong" = "subtle",
): { backgroundColor: string; textColor: string; borderColor: string } {
  const intensityMap = {
    subtle: { alpha: 0.05, shade: 50 },
    medium: { alpha: 0.1, shade: 100 },
    strong: { alpha: 0.2, shade: 200 },
  };

  const config = intensityMap[intensity];

  let backgroundColor: string;
  let baseColorFamily: Record<string | number, string>;

  switch (contentType) {
    case "success":
      baseColorFamily = COLOR_PALETTE.success;
      backgroundColor = baseColorFamily[config.shade];
      break;
    case "error":
      baseColorFamily = COLOR_PALETTE.error;
      backgroundColor = baseColorFamily[config.shade];
      break;
    case "warning":
      baseColorFamily = COLOR_PALETTE.warning;
      backgroundColor = baseColorFamily[config.shade];
      break;
    case "info":
      baseColorFamily = COLOR_PALETTE.info;
      backgroundColor = baseColorFamily[config.shade];
      break;
    case "primary":
      baseColorFamily = COLOR_PALETTE.primary;
      backgroundColor = baseColorFamily[config.shade];
      break;
    default:
      baseColorFamily = COLOR_PALETTE.gray;
      backgroundColor = "#ffffff";
  }

  const textColor = getBestTextColor(backgroundColor, "AA", "normal");
  const borderColor =
    contentType === "neutral"
      ? COLOR_PALETTE.gray[200]
      : chroma(backgroundColor).darken(0.5).alpha(0.3).hex();

  return {
    backgroundColor,
    textColor,
    borderColor,
  };
}

/**
 * Utility for creating contrast-safe CSS custom properties
 */
export function createContrastCSS(
  prefix: string,
  backgroundColor: string,
  level: ContrastLevel = "AA",
): Record<string, string> {
  const textColor = getBestTextColor(backgroundColor, level, "normal");
  const palette = generateContrastPalette(textColor, backgroundColor);

  return {
    [`--${prefix}-bg`]: backgroundColor,
    [`--${prefix}-text-primary`]: palette.primary,
    [`--${prefix}-text-secondary`]: palette.secondary,
    [`--${prefix}-text-muted`]: palette.muted,
    [`--${prefix}-text-disabled`]: palette.disabled,
    [`--${prefix}-border`]: palette.light,
  };
}

/**
 * Validate accessibility compliance for a design system
 */
export function validateAccessibility(colors: Record<string, string>): {
  valid: boolean;
  issues: Array<{ combination: string; ratio: number; required: number }>;
} {
  const issues: Array<{
    combination: string;
    ratio: number;
    required: number;
  }> = [];

  // Common text/background combinations to test
  const combinations = [
    {
      fg: colors.textPrimary || "#000000",
      bg: colors.background || "#ffffff",
      name: "Primary Text",
    },
    {
      fg: colors.textSecondary || "#6b7280",
      bg: colors.background || "#ffffff",
      name: "Secondary Text",
    },
    {
      fg: colors.textMuted || "#9ca3af",
      bg: colors.background || "#ffffff",
      name: "Muted Text",
    },
  ];

  combinations.forEach(({ fg, bg, name }) => {
    if (fg && bg) {
      const ratio = getContrastRatio(fg, bg);
      if (ratio < CONTRAST_STANDARDS.AA_NORMAL) {
        issues.push({
          combination: name,
          ratio,
          required: CONTRAST_STANDARDS.AA_NORMAL,
        });
      }
    }
  });

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Theme-aware color utilities
 */
export class ContrastManager {
  private isDarkMode: boolean;

  constructor(isDarkMode: boolean = false) {
    this.isDarkMode = isDarkMode;
  }

  setDarkMode(enabled: boolean): void {
    this.isDarkMode = enabled;
  }

  getBaseBackground(): string {
    return this.isDarkMode ? COLOR_PALETTE.gray[900] : COLOR_PALETTE.white;
  }

  getBaseTextColor(): string {
    return this.isDarkMode ? COLOR_PALETTE.white : COLOR_PALETTE.black;
  }

  getContrastColor(
    color: string,
    level: ContrastLevel = "AA",
    textSize: TextSize = "normal",
  ): string {
    const background = this.getBaseBackground();
    return adjustForContrast(color, background, level, textSize);
  }

  createThemeColors() {
    const background = this.getBaseBackground();

    return {
      background,
      foreground: this.getBaseTextColor(),
      primary: this.getContrastColor(COLOR_PALETTE.primary[600]),
      secondary: this.getContrastColor(COLOR_PALETTE.gray[600]),
      muted: this.getContrastColor(COLOR_PALETTE.gray[500], "AA", "normal"),
      accent: this.getContrastColor(COLOR_PALETTE.primary[500]),
      success: this.getContrastColor(COLOR_PALETTE.success[600]),
      error: this.getContrastColor(COLOR_PALETTE.error[600]),
      warning: this.getContrastColor(COLOR_PALETTE.warning[600]),
      info: this.getContrastColor(COLOR_PALETTE.info[600]),
    };
  }
}

/**
 * Hook-like utility for React components
 */
export function useContrastColors(
  backgroundColor?: string,
  level: ContrastLevel = "AA",
) {
  const bg = backgroundColor || COLOR_PALETTE.white;

  return {
    backgroundColor: bg,
    textColor: getBestTextColor(bg, level, "normal"),
    secondaryTextColor: getBestTextColor(bg, level, "large"),
    palette: generateContrastPalette(getBestTextColor(bg, level, "normal"), bg),
    isAccessible: (textColor: string) =>
      meetsContrastStandard(textColor, bg, level, "normal"),
  };
}
