# Deployment Guide - Database Startup Validation

This document explains how to deploy the SOAR Feedback System with automatic database validation and migration.

## Overview

The application includes several startup scripts that validate database connectivity and automatically run migrations when deploying to new environments.

## Available Scripts

### Development Scripts

- `npm run startup` - Run database validation in development (uses `.env.local`)
- `npm run db:test` - Test database connection
- `npm run db:migrate` - Run database migrations manually
- `npm run db:status` - Check database status

### Production Scripts

- `npm run startup:prod` - Run database validation in production (uses environment variables)
- `npm run start:prod` - Complete production startup (validation + server start)

## Deployment Process

### 1. Environment Variables

Ensure your deployment environment has the following variables:

```env
DATABASE_URL=postgres://user:password@host:port/database?sslmode=disable
NODE_ENV=production
GROQ_API_KEY=your_groq_api_key
```

**Important:** For SSL issues, use one of these `sslmode` options:
- `sslmode=disable` - No SSL (recommended for most cases)
- `sslmode=prefer` - Try SSL, fallback to no SSL
- `sslmode=require` - Require SSL (only if your DB supports it)

### 2. Build Process

```bash
npm install
npm run build
```

### 3. Startup Process

#### Option A: Manual Validation (Recommended)
```bash
# Run validation first
npm run startup:prod

# If validation passes, start the server
npm start
```

#### Option B: Combined Startup
```bash
# Validates database then starts server
npm run start:prod
```

### 4. Health Check

The application provides a health check endpoint:

```
GET /api/health
```

Returns:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "version": "PostgreSQL",
    "tableExists": true,
    "feedbackCount": 42,
    "responseTimeMs": 15
  },
  "environment": {
    "nodeEnv": "production",
    "databaseUrl": "configured"
  },
  "timestamp": "2025-07-07T14:30:00.000Z"
}
```

## What the Startup Script Does

### 1. Database Connection Test
- Tests connectivity with retry logic (3 attempts with exponential backoff)
- Validates SSL configuration
- Provides detailed error messages for connection issues

### 2. Database Structure Validation
- Checks if the `feedback` table exists
- Validates table structure (columns, types, constraints)
- Ensures required indexes are present

### 3. Automatic Migration
- Runs migrations automatically if:
  - Tables don't exist
  - Table structure is outdated
  - Database is completely empty

### 4. Health Check
- Performs basic CRUD operation tests
- Validates database performance
- Ensures application readiness

## Migration Details

The migration creates:

### Tables
- `feedback` table with columns:
  - `id` (SERIAL PRIMARY KEY)
  - `audio_url` (TEXT NOT NULL)
  - `transcription` (TEXT NOT NULL)
  - `csat` (INTEGER)
  - `additional_comment` (TEXT)
  - `created_at` (TIMESTAMP DEFAULT NOW() NOT NULL)

### Indexes
- `idx_feedback_created_at` - For date-based queries
- `idx_feedback_csat` - For CSAT filtering

## Error Handling

### Common Issues and Solutions

#### 1. SSL Connection Errors
```
Error: The server does not support SSL connections
```
**Solution:** Change your `DATABASE_URL` to use `sslmode=disable`

#### 2. Connection Timeout
```
Error: connection timeout
```
**Solution:** Check if your database server is running and accessible

#### 3. Database Not Found
```
Error: database "dbname" does not exist
```
**Solution:** Create the database or update the `DATABASE_URL`

#### 4. Permission Errors
```
Error: permission denied
```
**Solution:** Ensure the database user has CREATE and INSERT permissions

## Coolify Deployment

For Coolify deployments:

1. **Build Command:**
   ```bash
   npm install && npm run build
   ```

2. **Start Command:**
   ```bash
   npm run start:prod
   ```

3. **Environment Variables:**
   Set these in your Coolify application settings:
   - `DATABASE_URL`
   - `NODE_ENV=production`
   - `GROQ_API_KEY`

4. **Health Check:**
   Configure Coolify to use `/api/health` endpoint for health monitoring

## Troubleshooting

### Check Application Logs
Monitor the startup logs for detailed information:
- Database connection attempts
- Migration execution
- Health check results

### Manual Database Operations
If automatic migration fails, you can run manual commands:

```bash
# Test connection
npm run db:test

# Run migration manually
npm run db:migrate

# Check database status
npm run db:status
```

### Database Connection Issues
1. Verify DATABASE_URL format
2. Check SSL mode settings
3. Ensure database server is accessible
4. Verify user permissions

## Best Practices

1. **Always run startup validation** before starting the server in production
2. **Monitor health check endpoint** for ongoing database health
3. **Use SSL disable mode** unless your database specifically requires SSL
4. **Keep backups** before running migrations in production
5. **Test migrations** in a staging environment first

## Support

If you encounter issues:
1. Check the application logs
2. Verify environment variables
3. Test database connectivity manually
4. Review the health check endpoint response
