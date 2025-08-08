"use client";

import { useEffect, useState } from "react";
import {
  ContrastLevel,
  TextSize,
  getBestTextColor,
  getContrastRatio,
  getSmartBackground,
  generateContrastPalette,
  meetsContrastStandard,
  ContrastManager,
} from "@/lib/contrast";

export interface UseContrastOptions {
  level?: ContrastLevel;
  textSize?: TextSize;
  detectDarkMode?: boolean;
}

export interface ContrastColors {
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  mutedTextColor: string;
  borderColor: string;
  palette: ReturnType<typeof generateContrastPalette>;
}

export interface ContrastUtils {
  isAccessible: (foreground: string, background?: string) => boolean;
  getTextColor: (background: string) => string;
  adjustColor: (color: string, background?: string) => string;
  getSmartBg: (
    contentType?: Parameters<typeof getSmartBackground>[0],
    intensity?: Parameters<typeof getSmartBackground>[1],
  ) => ReturnType<typeof getSmartBackground>;
}

/**
 * Hook for managing contrast and accessibility in React components
 */
export function useContrast(
  backgroundColor?: string,
  options: UseContrastOptions = {},
): ContrastColors & ContrastUtils {
  const { level = "AA", textSize = "normal", detectDarkMode = true } = options;

  const [, setIsDarkMode] = useState(false);
  const [manager] = useState(() => new ContrastManager(false));

  // Detect dark mode preference
  useEffect(() => {
    if (!detectDarkMode) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      manager.setDarkMode(e.matches);
    };

    setIsDarkMode(mediaQuery.matches);
    manager.setDarkMode(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [detectDarkMode, manager]);

  // Get effective background color
  const effectiveBackground = backgroundColor || manager.getBaseBackground();

  // Generate contrast-safe colors
  const textColor = getBestTextColor(effectiveBackground, level, textSize);
  const palette = generateContrastPalette(textColor, effectiveBackground);

  const colors: ContrastColors = {
    backgroundColor: effectiveBackground,
    textColor: palette.primary,
    secondaryTextColor: palette.secondary,
    mutedTextColor: palette.muted,
    borderColor: palette.light,
    palette,
  };

  const utils: ContrastUtils = {
    isAccessible: (foreground: string, background = effectiveBackground) =>
      meetsContrastStandard(foreground, background, level, textSize),

    getTextColor: (background: string) =>
      getBestTextColor(background, level, textSize),

    adjustColor: (color: string) =>
      manager.getContrastColor(color, level, textSize),

    getSmartBg: (contentType, intensity) =>
      getSmartBackground(contentType, intensity),
  };

  return {
    ...colors,
    ...utils,
  };
}

/**
 * Hook for getting theme-aware colors
 */
export function useThemeColors() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [manager] = useState(() => new ContrastManager(false));

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      manager.setDarkMode(e.matches);
    };

    setIsDarkMode(mediaQuery.matches);
    manager.setDarkMode(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [manager]);

  return {
    isDarkMode,
    colors: manager.createThemeColors(),
    manager,
  };
}

/**
 * Hook for validating color combinations
 */
export function useContrastValidation(
  foreground: string,
  background: string,
  level: ContrastLevel = "AA",
  textSize: TextSize = "normal",
) {
  const ratio = getContrastRatio(foreground, background);
  const isValid = meetsContrastStandard(
    foreground,
    background,
    level,
    textSize,
  );

  return {
    ratio,
    isValid,
    level,
    textSize,
    recommendation: !isValid
      ? getBestTextColor(background, level, textSize)
      : null,
  };
}

/**
 * Hook for creating CSS custom properties with proper contrast
 */
export function useContrastCSS(
  backgroundColor: string,
  prefix: string = "contrast",
): Record<string, string> {
  const { palette } = useContrast(backgroundColor);

  return {
    [`--${prefix}-bg`]: backgroundColor,
    [`--${prefix}-text-primary`]: palette.primary,
    [`--${prefix}-text-secondary`]: palette.secondary,
    [`--${prefix}-text-muted`]: palette.muted,
    [`--${prefix}-text-disabled`]: palette.disabled,
    [`--${prefix}-border`]: palette.light,
    [`--${prefix}-accent`]: palette.dark,
  };
}
