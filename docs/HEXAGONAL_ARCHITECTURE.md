# Hexagonal Architecture Implementation

This document describes the hexagonal architecture implementation applied to the SOAR Feedback System.

## 🏗️ Architecture Overview

The codebase follows **Hexagonal Architecture** (also known as Ports and Adapters pattern) along with **Atomic Design** principles and **SOLID** principles for clean, maintainable, and testable code.

## 📁 Project Structure

```
src/
├── domain/                    # Domain layer (business entities)
│   ├── AudioFeedback.ts      # Core business entity
│   └── README.md
├── ports/                     # Port interfaces (contracts)
│   ├── AudioFeedbackPorts.ts # Audio-related port interfaces
│   ├── FeedbackRepositoryPort.ts
│   └── README.md
├── adapters/                  # Adapter implementations
│   ├── BrowserAudioRecordingAdapter.ts
│   ├── GroqTranscriptionAdapter.ts
│   ├── GroqServerTranscriptionAdapter.ts
│   ├── RestFeedbackSubmissionAdapter.ts
│   ├── InMemoryFeedbackRepository.ts
│   └── README.md
├── application/               # Use cases (business logic)
│   ├── SubmitAudioFeedbackUseCase.ts
│   ├── TranscribeAudioUseCase.ts
│   ├── SubmitFeedback.ts
│   └── README.md
├── services/                  # Service layer (facade)
│   └── AudioFeedbackService.ts
├── hooks/                     # React hooks (UI layer)
│   └── useAudioFeedback.ts
├── components/                # UI components (atomic design)
│   ├── atoms/                 # Basic building blocks
│   │   ├── AudioRecordingButton/
│   │   ├── ErrorMessage/
│   │   ├── LoadingSpinner/
│   │   ├── Button/
│   │   ├── Icon/
│   │   ├── Text/
│   │   └── TTSPlayer/
│   ├── molecules/             # Combinations of atoms
│   │   ├── AudioRecordingSection/
│   │   ├── TranscriptionDisplaySection/
│   │   ├── FeedbackFormSection/
│   │   ├── NPSSurvey/
│   │   ├── PostRecordingActions/
│   │   ├── RecordButton/
│   │   └── TranscriptionDisplay/
│   └── organisms/             # Combinations of molecules
│       ├── SimpleFeedbackForm/
│       └── AudioTranscriber/
└── app/                       # Next.js app router
    ├── page.tsx               # Main page (presentation layer)
    └── api/                   # API routes (infrastructure)
        ├── transcribe/
        └── feedback/
```

## 🎯 Design Principles Applied

### 1. Hexagonal Architecture (Ports & Adapters)

**Ports** (Interfaces):

- `AudioTranscriptionPort`: Contract for audio transcription services
- `FeedbackSubmissionPort`: Contract for feedback submission services
- `AudioRecordingPort`: Contract for audio recording services
- `FeedbackRepositoryPort`: Contract for feedback storage

**Adapters** (Implementations):

- `GroqTranscriptionAdapter`: Groq API implementation for transcription
- `RestFeedbackSubmissionAdapter`: REST API implementation for feedback submission
- `BrowserAudioRecordingAdapter`: Web Audio API implementation for recording
- `InMemoryFeedbackRepository`: In-memory implementation for feedback storage

### 2. Atomic Design

**Atoms** (Basic UI elements):

- `AudioRecordingButton`: Single-purpose recording button
- `ErrorMessage`: Reusable error display component
- `LoadingSpinner`: Reusable loading indicator
- `Button`, `Icon`, `Text`: Basic UI primitives

**Molecules** (Combinations of atoms):

- `AudioRecordingSection`: Recording functionality with status
- `TranscriptionDisplaySection`: Transcription display logic
- `FeedbackFormSection`: Form inputs and validation

**Organisms** (Complex components):

- `SimpleFeedbackForm`: Complete feedback form workflow

### 3. SOLID Principles

**Single Responsibility Principle (SRP)**:

- Each class/component has one reason to change
- `TranscribeAudioUseCase` only handles transcription logic
- `AudioRecordingButton` only handles recording button UI

**Open/Closed Principle (OCP)**:

- Components are open for extension, closed for modification
- New transcription providers can be added by implementing `AudioTranscriptionPort`

**Liskov Substitution Principle (LSP)**:

- Adapters can be substituted without breaking functionality
- Any `AudioTranscriptionPort` implementation works interchangeably

**Interface Segregation Principle (ISP)**:

- Ports are focused and specific to their use case
- `AudioTranscriptionPort` only defines transcription methods

**Dependency Inversion Principle (DIP)**:

- High-level modules don't depend on low-level modules
- Use cases depend on port interfaces, not concrete implementations

### 4. DRY (Don't Repeat Yourself)

- `useAudioFeedback` hook encapsulates common audio feedback logic
- Shared atomic components eliminate UI code duplication
- Common error handling patterns in adapters

### 5. KISS (Keep It Simple, Stupid)

- Simple, focused components with clear responsibilities
- Straightforward data flow from UI → Service → Use Case → Adapter
- Minimal abstraction layers

## 🔄 Data Flow

```
UI Component → Custom Hook → Service Layer → Use Case → Port → Adapter → External Service
```

### Example: Audio Transcription Flow

1. `SimpleFeedbackForm` calls `useAudioFeedback.transcribeAudio()`
2. `useAudioFeedback` calls `AudioFeedbackService.transcribeAudio()`
3. `AudioFeedbackService` calls `TranscribeAudioUseCase.execute()`
4. `TranscribeAudioUseCase` calls `AudioTranscriptionPort.transcribeAudio()`
5. `GroqTranscriptionAdapter` implements the port and calls Groq API
6. Result flows back through the layers to update UI

## 🧪 Testing Strategy

### Unit Tests

- **Domain entities**: Test business logic in `AudioFeedback`
- **Use cases**: Test business workflows in isolation
- **Adapters**: Test external service integration

### Integration Tests

- **Service layer**: Test complete workflows
- **API routes**: Test end-to-end API functionality

### Component Tests

- **Atoms**: Test individual component behavior
- **Molecules**: Test component composition
- **Organisms**: Test complex user workflows

## 🔧 Extension Points

### Adding New Transcription Provider

1. Implement `AudioTranscriptionPort`:

```typescript
export class NewTranscriptionAdapter implements AudioTranscriptionPort {
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    // Implementation
  }
}
```

2. Update `AudioFeedbackService` to use new adapter:

```typescript
const transcriptionAdapter = new NewTranscriptionAdapter();
```

### Adding New UI Component

1. Follow atomic design hierarchy
2. Keep components focused and reusable
3. Use composition over inheritance

## 📚 Benefits

- **Testability**: Business logic is isolated and easily testable
- **Maintainability**: Clear separation of concerns
- **Flexibility**: Easy to swap implementations
- **Scalability**: New features can be added without affecting existing code
- **Code Reuse**: Atomic components promote reusability
- **Type Safety**: Full TypeScript support with proper interfaces
