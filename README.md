# SOAR Feedback System

A modern audio transcription and feedback system built with Next.js, featuring AI-powered speech-to-text capabilities using Groq.

## 🚀 Features

- **Audio Recording**: Record audio directly in the browser
- **AI Transcription**: Convert speech to text using Groq's Whisper model
- **Modern UI**: Beautiful, responsive interface with Material-UI and Tailwind CSS
- **Clean Architecture**: Domain-driven design with TypeScript
- **Real-time Processing**: Immediate transcription results

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Material-UI + Tailwind CSS
- **AI**: Groq SDK for transcription
- **Architecture**: Clean Architecture with Ports & Adapters

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Groq API key ([Get one here](https://console.groq.com/))

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd soar-feedback-system
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Groq API Key for audio transcription
# Get your API key from: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
├── docs/              # Project documentation
├── drizzle/           # Database schema and migrations
├── lib/               # Utility modules and helpers
├── public/            # Static assets
├── scripts/           # Build and utility scripts
├── src/               # Application source code
│   ├── adapters/      # External service adapters
│   ├── app/           # Next.js app router
│   │   ├── api/       # API routes
│   │   └── page.tsx   # Main page
│   ├── application/   # Use cases and business logic
│   ├── components/    # React components (atoms, molecules, organisms)
│   ├── domain/        # Domain models and business rules
│   └── ports/         # Interface definitions
└── tests/             # E2E and integration tests
```

## 🎯 Usage

1. **Start Recording**: Click the microphone button to begin recording
2. **Speak**: Record your audio feedback
3. **Stop Recording**: Click the button again to stop
4. **View Transcription**: Your speech will be automatically transcribed
5. **Reset**: Click "Finish" to start a new recording

## 🔧 Development

The page auto-updates as you edit files. You can start editing by modifying:

- `src/app/page.tsx` - Main page layout
- `src/components/organisms/AudioTranscriber/` - Core transcription component
- `src/app/api/transcribe/route.ts` - Transcription API endpoint

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Material-UI Documentation](https://mui.com/) - UI component library
- [Groq Documentation](https://console.groq.com/docs) - AI transcription service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 🚀 Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📄 License

This project is private and proprietary.
