# Database Integration Guide

## Overview

The SOAR Feedback System uses PostgreSQL with Drizzle ORM for robust data persistence. The database configuration is environment-based and supports both development and production deployments.

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file in the root directory with the following configuration:

```bash
# Database Configuration
DATABASE_URL=postgres://username:password@hostname:port/database_name

# Example for local development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/soar_feedback

# Production example (replace with your actual values)
# DATABASE_URL=postgres://user:password@your-db-host.com:5432/soar_feedback_prod

# Other environment variables
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

### Environment Files Priority

1. `.env.local` (highest priority, for local development)
2. `.env` (general environment configuration)

## Database Setup

### 1. Local Development with Docker

Start the PostgreSQL database:

```bash
npm run db:start
```

### 2. Run Migrations

Initialize the database schema:

```bash
npm run db:migrate
```

### 3. Test Connection

Verify database connectivity:

```bash
npm run db:test
```

### 4. Check Database Status

Get comprehensive database information:

```bash
npm run db:status
```

## Database Commands

| Command              | Description                |
| -------------------- | -------------------------- |
| `npm run db:start`   | Start PostgreSQL container |
| `npm run db:stop`    | Stop PostgreSQL container  |
| `npm run db:test`    | Test database connection   |
| `npm run db:migrate` | Run database migrations    |
| `npm run db:seed`    | Add sample data            |
| `npm run db:status`  | Show database status       |
| `npm run db:cleanup` | Remove test data           |
| `npm run db:reset`   | Full database reset        |

## Database Schema

### Feedback Table

```sql
CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  audio_url TEXT NOT NULL,
  transcription TEXT NOT NULL,
  csat INTEGER,
  additional_comment TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Schema Fields

- `id`: Auto-incrementing primary key
- `audio_url`: Reference to audio file (placeholder or cloud storage URL)
- `transcription`: AI-generated text transcription
- `csat`: Customer Satisfaction score (0-10)
- `additional_comment`: Optional user comment
- `created_at`: Automatic timestamp

## API Endpoints

### Health Check

```bash
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "version": "PostgreSQL",
    "tableExists": true,
    "feedbackCount": 24,
    "responseTimeMs": 32
  },
  "environment": {
    "nodeEnv": "development",
    "databaseUrl": "configured"
  },
  "timestamp": "2025-07-07T15:32:18.653Z"
}
```

### Submit Feedback

```bash
POST /api/feedback
Content-Type: application/json

{
  "transcription": "User feedback transcription",
  "npsScore": 8,
  "additionalComment": "Optional comment"
}
```

Response:
```json
{
  "success": true,
  "id": 24,
  "message": "Feedback saved successfully",
  "timestamp": "2025-07-07T15:32:27.273Z"
}
```

### Retrieve Feedback

```bash
GET /api/feedback?limit=10&offset=0
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 24
  }
}
```

## Connection Configuration

### Development Setup

The system uses connection pooling for better performance:

```typescript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum connections
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 2000, // 2 seconds
});
```

### Error Handling

The database configuration includes comprehensive error handling:

- Connection timeout errors (504)
- Database unavailable errors (503)
- Validation errors (400)
- General server errors (500)

## Production Deployment

### 1. Set Production Environment Variables

```bash
DATABASE_URL=postgres://username:password@production-host:5432/database
NODE_ENV=production
GROQ_API_KEY=production_api_key
```

### 2. Run Migrations

```bash
npm run db:migrate
```

### 3. Verify Health

```bash
curl https://your-domain.com/api/health
```

## Monitoring

### Health Checks

Monitor database health using the `/api/health` endpoint which provides:

- Connection status
- Database version
- Table existence
- Record counts
- Response times

### Logging

Database operations are logged with:

- Connection attempts
- Query execution times
- Error details
- Performance metrics

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Check if PostgreSQL is running
   npm run db:start
   ```

2. **Environment Variables Not Loaded**
   ```bash
   # Verify .env.local exists and has correct values
   cat .env.local
   ```

3. **Table Not Found**
   ```bash
   # Run migrations
   npm run db:migrate
   ```

4. **Permission Denied**
   ```bash
   # Check database user permissions
   # Ensure user has CREATE, SELECT, INSERT, UPDATE, DELETE privileges
   ```

### Debug Commands

```bash
# Test connection
npm run db:test

# Check database status
npm run db:status

# View logs
docker logs soar-feedback-system-postgres-1
```

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Connection String**: Use environment variables for sensitive data
3. **Database User**: Use principle of least privilege
4. **SSL**: Enable SSL for production connections
5. **Backup**: Implement regular database backups

## Backup and Recovery

### Development

Data is persisted in Docker volumes:
```bash
# Backup
docker exec soar-feedback-system-postgres-1 pg_dump -U postgres soar_feedback > backup.sql

# Restore
docker exec -i soar-feedback-system-postgres-1 psql -U postgres soar_feedback < backup.sql
```

### Production

Implement automated backups based on your hosting provider's recommendations.
