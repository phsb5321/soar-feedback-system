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

---

# Updated Implementation - Database Migrations and Seeders

## Overview

This section documents the enhanced hexagonal architecture implementation for database migrations and seeders, following the guidelines in AI.MD.

## Architecture Overview

### Enhanced Hexagonal Architecture Components

The system now follows a more complete hexagonal architecture pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Core                          │
├─────────────────────────────────────────────────────────────────┤
│  Domain Models: Feedback                                        │
├─────────────────────────────────────────────────────────────────┤
│  Ports (Interfaces):                                           │
│  - MigrationPort                                               │
│  - SeederPort                                                  │
│  - FeedbackRepositoryPort                                      │
│  - TranscriptionPort                                           │
├─────────────────────────────────────────────────────────────────┤
│  Services: DatabaseInitializationService                       │
├─────────────────────────────────────────────────────────────────┤
│  Adapters (Implementations):                                   │
│  - DrizzleMigrationAdapter                                     │
│  - DrizzleSeederAdapter                                        │
│  - DrizzleFeedbackSubmissionAdapter                            │
│  - GroqTranscriptionAdapter                                    │
└─────────────────────────────────────────────────────────────────┘
```

## New Port Interfaces

### MigrationPort
```typescript
export interface MigrationPort {
  runMigrations(): Promise<void>;
  isMigrationRequired(): Promise<boolean>;
  getMigrationStatus(): Promise<MigrationStatus>;
  rollbackMigration(): Promise<void>;
}
```

### SeederPort
```typescript
export interface SeederPort {
  runSeeders(): Promise<void>;
  runSeeder(seederName: string): Promise<SeederResult>;
  isSeedingRequired(): Promise<boolean>;
  getAvailableSeeders(): Promise<string[]>;
  clearSeededData(): Promise<void>;
}
```

## New Adapter Implementations

### DrizzleMigrationAdapter
- Implements database migrations using Drizzle ORM
- Handles schema creation and validation
- Provides migration status tracking
- Supports rollback operations (placeholder)

### DrizzleSeederAdapter
- Implements database seeding functionality
- Manages sample data insertion
- Tracks seeding results and errors
- Supports selective seeding

## Enhanced Service Layer

### DatabaseInitializationService
- Orchestrates migration and seeding operations
- Singleton pattern for consistent state management
- Configurable initialization options
- Health check capabilities

## Docker Compose Integration

### Enhanced Configuration

The Docker Compose setup now includes:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: soar_postgres_local
    environment:
      POSTGRES_DB: soar_feedback
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d soar_feedback"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - soar_network

  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: soar_app_local
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/soar_feedback?sslmode=disable
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - soar_network
    profiles:
      - full-stack
```

## Available Scripts

### Database Operations

```bash
# Run migrations only
npm run db:migrate:only

# Run migrations with seeding
npm run db:migrate

# Run seeders only
npm run db:seed

# Check database status
npm run db:status

# Test database connectivity
npm run db:test

# SSL troubleshooting
npm run db:ssl-test
```

### Development

```bash
# Start development server with auto-migration and seeding
npm run dev:full

# Start development server (basic)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Docker Commands

```bash
# Start database only
npm run docker:db

# Start full development stack
npm run docker:dev

# View logs
npm run docker:logs

# Stop all services
npm run docker:down
```

## Environment Configuration

### Required Variables

```bash
# Database (Required)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/soar_feedback?sslmode=disable

# Transcription Service (Required)
GROQ_API_KEY=your_groq_api_key_here

# Application (Optional)
NODE_ENV=development
LOG_LEVEL=info
```

### Docker Compose Variables

```bash
# Database configuration
POSTGRES_DB=soar_feedback
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

# Application configuration
APP_PORT=3000
```

## Coolify Deployment

### Deployment Strategy

1. **Database Setup**: Create PostgreSQL service in Coolify
2. **Environment Variables**: Configure production DATABASE_URL
3. **Build Configuration**: Use `npm run build`
4. **Start Command**: Use `npm run start:prod`
5. **Health Check**: Use `/api/health` endpoint

### Key Features

- Automatic migrations on deployment
- SSL certificate handling
- Health check monitoring
- Environment-specific configurations
- Backup and recovery procedures

### Production Environment Variables

```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
GROQ_API_KEY=production_key
```

## Testing and Validation

### Local Testing

```bash
# Test build
npm run build

# Test startup with seeding
npm run startup:hex -- --seeders --verbose

# Test Docker Compose
npm run docker:db
npm run dev:full
```

### Health Checks

The system provides comprehensive health checks:

```json
{
  "status": "healthy",
  "timestamp": "2025-07-14T19:00:00.000Z",
  "database": {
    "connected": true,
    "tableExists": true
  },
  "version": "0.1.0"
}
```

## Error Handling

### Migration Errors

- Connection failures: Retry logic with exponential backoff
- Schema conflicts: Detailed error reporting
- Permission issues: Clear error messages

### Seeding Errors

- Data conflicts: Graceful handling of duplicate data
- Validation errors: Detailed field-level error reporting
- Transaction rollback: Atomic operations

## Performance Considerations

### Database

- Connection pooling via Drizzle ORM
- Proper indexing strategy
- Query optimization
- Health check monitoring

### Application

- Lazy loading of services
- Singleton pattern for database service
- Efficient error handling
- Resource cleanup

## Security Best Practices

### Database Security

- SSL connections in production
- Environment variable protection
- Connection string encryption
- Access control implementation

### Application Security

- Input validation
- SQL injection prevention
- Environment isolation
- Secure logging practices

## Monitoring and Logging

### Structured Logging

```typescript
console.log("🚀 SOAR Feedback System - Starting up...");
console.log("✅ Database migrations completed successfully");
console.log("🌱 Seeding completed: 1/1 seeders successful");
console.log("🔍 Performing database health check...");
```

### Health Monitoring

- Database connectivity checks
- Migration status tracking
- Seeding result monitoring
- Performance metrics

## Future Enhancements

### Planned Features

1. **Migration Rollback**: Implement proper rollback functionality
2. **Multi-Environment Support**: Enhanced environment management
3. **Advanced Seeding**: Conditional and dependency-based seeding
4. **Monitoring Dashboard**: Real-time health and performance monitoring
5. **Backup Integration**: Automated backup and restore procedures

### Technical Improvements

1. **Performance Optimization**: Query optimization and caching
2. **Security Enhancements**: Advanced authentication and authorization
3. **Observability**: Comprehensive logging and monitoring
4. **Testing**: Unit and integration test coverage
5. **Documentation**: API documentation and developer guides

## Conclusion

The enhanced hexagonal architecture implementation provides a robust, maintainable, and scalable foundation for the SOAR Feedback System. The clear separation of concerns, proper error handling, and comprehensive testing ensure reliable database operations in both development and production environments.

The Docker Compose setup enables efficient local development, while the Coolify deployment documentation provides clear guidance for production deployment. The system is designed to be extensible and maintainable, following best practices and design patterns.

---

**Version**: 2.0.0  
**Last Updated**: July 14, 2025  
**Author**: AI Assistant following hexagonal architecture principles
