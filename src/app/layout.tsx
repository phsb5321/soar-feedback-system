import { AudioToggle } from "@/components/atoms/AudioToggle/AudioToggle";
import { AudioBlockingOverlay } from "@/components/providers/AudioBlockingOverlay";
import { GlobalAudioInterceptor } from "@/components/providers/GlobalAudioInterceptor";
import type { Metadata, Viewport } from "next";
import { Fira_Code, Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "SOAR - Sistema de Transcrição de Áudio",
  description:
    "Sistema inteligente de transcrição de áudio em tempo real powered by AI",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Optimize for mobile devices
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${firaCode.variable} antialiased`}
        suppressHydrationWarning
      >
        <GlobalAudioInterceptor />
        <AudioBlockingOverlay />
        {children}
        <AudioToggle />
      </body>
    </html>
  );
}
