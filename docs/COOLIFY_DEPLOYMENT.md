# Coolify Deployment Guide for SOAR Feedback System

## Overview

This guide provides best practices for deploying the SOAR Feedback System on Coolify with PostgreSQL database integration, automated migrations, and proper environment management.

## Prerequisites

- Coolify instance running and accessible
- PostgreSQL database service in Coolify
- Git repository connected to Coolify
- Required environment variables configured

## Database Setup in Coolify

### 1. Create PostgreSQL Database

1. Go to Coolify dashboard
2. Navigate to "Databases" section
3. Click "Create New Database"
4. Select "PostgreSQL 15"
5. Configure:
   - **Name**: `soar-feedback-db`
   - **Username**: `soar_user` (or your preference)
   - **Password**: Generate a strong password
   - **Database Name**: `soar_feedback`

### 2. Database Configuration

After creating the database:
- Note down the connection details
- Ensure the database is accessible from your application
- Configure backup settings if needed

## Application Deployment

### 1. Environment Variables

Set the following environment variables in Coolify:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@database-host:5432/soar_feedback?sslmode=require

# Application Configuration
NODE_ENV=production
GROQ_API_KEY=your_groq_api_key_here

# Optional: Logging and Debugging
DEBUG=soar:*
LOG_LEVEL=info
```

### 2. Build Configuration

In Coolify application settings:

**Build Command:**
```bash
npm ci --only=production && npm run build
```

**Start Command:**
```bash
npm run start:prod
```

**Health Check URL:**
```
/api/health
```

### 3. Startup Script Configuration

The application uses a production startup script that handles:
- Database connection testing
- Automatic migrations
- Health checks
- Error handling

### 4. SSL Configuration

For production PostgreSQL connections, ensure:
- `sslmode=require` in DATABASE_URL
- Valid SSL certificates on database server
- Network security groups allow connections

## Deployment Process

### Automatic Deployment (Recommended)

1. **Git Integration**: Connect your repository to Coolify
2. **Auto-deploy**: Enable auto-deployment on push to main branch
3. **Build Process**:
   ```
   git push → Coolify Build → Migration → Health Check → Deploy
   ```

### Manual Deployment

1. Trigger deployment in Coolify dashboard
2. Monitor build logs for any issues
3. Check application logs after deployment
4. Verify health check endpoint

## Environment-Specific Configurations

### Development
```bash
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/soar_feedback_dev
```

### Staging
```bash
NODE_ENV=staging
DATABASE_URL=postgresql://staging-host:5432/soar_feedback_staging?sslmode=require
```

### Production
```bash
NODE_ENV=production
DATABASE_URL=postgresql://prod-host:5432/soar_feedback?sslmode=require
```

## Migration Strategy

### Automatic Migrations
The application automatically runs migrations on startup:

1. **Connection Test**: Verify database connectivity
2. **Schema Check**: Validate existing schema
3. **Migration Run**: Apply pending migrations
4. **Health Check**: Verify application readiness

### Migration Scripts Available

```bash
# Run migrations only
npm run db:migrate:only

# Run migrations with seeding
npm run db:migrate

# Check migration status
npm run db:status
```

## Monitoring and Logging

### Health Check Endpoint
```
GET /api/health
```

Response:
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

### Application Logs
Monitor these log patterns:
- `✅ Database connection successful`
- `✅ Migration completed successfully`
- `🎉 Deployment validation completed successfully`
- `❌` for any errors

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check environment variables
   echo $DATABASE_URL
   
   # Test SSL connection
   npm run db:ssl-test
   ```

2. **Migration Errors**
   ```bash
   # Check migration status
   npm run db:status
   
   # Run migrations manually
   npm run db:migrate:only
   ```

3. **Build Failures**
   - Verify Node.js version compatibility
   - Check TypeScript compilation errors
   - Ensure all dependencies are available

### Recovery Procedures

1. **Database Schema Reset** (Development only):
   ```bash
   npm run db:reset
   ```

2. **Force Migration Re-run**:
   ```bash
   npm run startup:hex -- --verbose --force
   ```

## Security Best Practices

### Database Security
- Use strong passwords
- Enable SSL connections
- Configure proper firewall rules
- Regular security updates

### Application Security
- Keep dependencies updated
- Use environment variables for secrets
- Enable HTTPS in production
- Configure proper CORS settings

### Coolify Security
- Regular Coolify updates
- Secure access to Coolify dashboard
- Use SSH keys for Git access
- Monitor deployment logs

## Performance Optimization

### Database
- Regular VACUUM and ANALYZE
- Proper indexing strategy
- Connection pooling
- Query optimization

### Application
- Enable Next.js caching
- Optimize bundle size
- Use CDN for static assets
- Monitor memory usage

## Backup and Recovery

### Database Backups
Coolify provides automatic backup features:
1. Configure backup schedule
2. Set retention policies
3. Test restore procedures
4. Monitor backup success

### Application Backups
- Git repository serves as code backup
- Environment variables backup
- Configuration backup

## Advanced Configuration

### Custom Domain
1. Configure domain in Coolify
2. Set up SSL certificates
3. Configure DNS records
4. Test domain accessibility

### Scaling
- Horizontal scaling with multiple instances
- Load balancer configuration
- Database read replicas
- CDN integration

## Support and Resources

- [Coolify Documentation](https://coolify.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

## Version History

- **v1.0**: Initial deployment guide
- **v1.1**: Added hexagonal architecture migration strategy
- **v1.2**: Enhanced security and monitoring sections
