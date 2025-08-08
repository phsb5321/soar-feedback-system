"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  ContrastManager,
  ContrastLevel,
  getSmartBackground,
} from "@/lib/contrast";

export interface ContrastContextValue {
  manager: ContrastManager;
  isDarkMode: boolean;
  contrastLevel: ContrastLevel;
  colors: ReturnType<ContrastManager["createThemeColors"]>;
  setContrastLevel: (level: ContrastLevel) => void;
  getSmartBackground: typeof getSmartBackground;
  refreshColors: () => void;
}

const ContrastContext = createContext<ContrastContextValue | null>(null);

export interface ContrastProviderProps {
  children: ReactNode;
  defaultLevel?: ContrastLevel;
  enableDarkModeDetection?: boolean;
}

export function ContrastProvider({
  children,
  defaultLevel = "AA",
  enableDarkModeDetection = true,
}: ContrastProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contrastLevel, setContrastLevel] =
    useState<ContrastLevel>(defaultLevel);
  const [manager] = useState(() => new ContrastManager(false));
  const [colors, setColors] = useState(() => manager.createThemeColors());

  // Dark mode detection
  useEffect(() => {
    if (!enableDarkModeDetection) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const darkMode = e.matches;
      setIsDarkMode(darkMode);
      manager.setDarkMode(darkMode);
      setColors(manager.createThemeColors());
    };

    // Set initial state
    const initialDarkMode = mediaQuery.matches;
    setIsDarkMode(initialDarkMode);
    manager.setDarkMode(initialDarkMode);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableDarkModeDetection, manager]);

  // Update colors when contrast level changes
  useEffect(() => {
    setColors(manager.createThemeColors());
  }, [contrastLevel, manager]);

  // Apply CSS custom properties to document root
  useEffect(() => {
    const root = document.documentElement;

    // Set theme colors as CSS custom properties
    root.style.setProperty("--contrast-bg-primary", colors.background);
    root.style.setProperty("--contrast-text-primary", colors.foreground);
    root.style.setProperty("--contrast-text-secondary", colors.secondary);
    root.style.setProperty("--contrast-text-muted", colors.muted);
    root.style.setProperty("--contrast-primary", colors.primary);
    root.style.setProperty("--contrast-accent", colors.accent);
    root.style.setProperty("--contrast-success", colors.success);
    root.style.setProperty("--contrast-error", colors.error);
    root.style.setProperty("--contrast-warning", colors.warning);
    root.style.setProperty("--contrast-info", colors.info);

    // Set semantic color classes
    root.style.setProperty("--semantic-bg", colors.background);
    root.style.setProperty("--semantic-text", colors.foreground);
    root.style.setProperty("--semantic-primary", colors.primary);
    root.style.setProperty("--semantic-secondary", colors.secondary);

    // Set dark mode class for compatibility
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    return () => {
      // Cleanup on unmount
      const properties = [
        "--contrast-bg-primary",
        "--contrast-text-primary",
        "--contrast-text-secondary",
        "--contrast-text-muted",
        "--contrast-primary",
        "--contrast-accent",
        "--contrast-success",
        "--contrast-error",
        "--contrast-warning",
        "--contrast-info",
        "--semantic-bg",
        "--semantic-text",
        "--semantic-primary",
        "--semantic-secondary",
      ];

      properties.forEach((prop) => root.style.removeProperty(prop));
    };
  }, [colors, isDarkMode]);

  const refreshColors = () => {
    setColors(manager.createThemeColors());
  };

  const contextValue: ContrastContextValue = {
    manager,
    isDarkMode,
    contrastLevel,
    colors,
    setContrastLevel,
    getSmartBackground,
    refreshColors,
  };

  return (
    <ContrastContext.Provider value={contextValue}>
      {children}
    </ContrastContext.Provider>
  );
}

export function useContrastContext(): ContrastContextValue {
  const context = useContext(ContrastContext);
  if (!context) {
    throw new Error(
      "useContrastContext must be used within a ContrastProvider",
    );
  }
  return context;
}

/**
 * Higher-order component for components that need contrast management
 */
export function withContrast<P extends object>(
  Component: React.ComponentType<P>,
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => {
    const contrast = useContrastContext();
    return <Component {...props} contrast={contrast} />;
  };

  WrappedComponent.displayName = `withContrast(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Component for applying smart backgrounds with proper contrast
 */
export interface SmartBackgroundProps {
  children: ReactNode;
  contentType?: Parameters<typeof getSmartBackground>[0];
  intensity?: Parameters<typeof getSmartBackground>[1];
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}

export function SmartBackground({
  children,
  contentType = "neutral",
  intensity = "subtle",
  className = "",
  style = {},
  as: Component = "div",
}: SmartBackgroundProps) {
  const { getSmartBackground: getSmartBg } = useContrastContext();
  const { backgroundColor, textColor, borderColor } = getSmartBg(
    contentType,
    intensity,
  );

  const combinedStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    borderColor,
    ...style,
  };

  return (
    <Component className={className} style={combinedStyle}>
      {children}
    </Component>
  );
}

/**
 * Debug component for visualizing contrast information
 */
export interface ContrastDebugProps {
  show?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function ContrastDebug({
  show = process.env.NODE_ENV === "development",
  position = "bottom-right",
}: ContrastDebugProps) {
  const { colors, contrastLevel, isDarkMode } = useContrastContext();

  if (!show) return null;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 p-3 rounded-lg shadow-lg text-xs font-mono`}
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
        border: `1px solid ${colors.secondary}`,
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="space-y-1">
        <div>Mode: {isDarkMode ? "Dark" : "Light"}</div>
        <div>Level: {contrastLevel}</div>
        <div>BG: {colors.background}</div>
        <div>Text: {colors.foreground}</div>
      </div>
    </div>
  );
}
