# Production Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] All default passwords changed
- [ ] Strong JWT_SECRET and NEXTAUTH_SECRET generated
- [ ] Secure ENCRYPTION_KEY configured (32 characters)
- [ ] HTTPS/TLS 1.3 enabled
- [ ] PostgreSQL configured with SSL
- [ ] Redis password protected
- [ ] WAF (Web Application Firewall) configured
- [ ] DDoS protection enabled
- [ ] Security audit completed
- [ ] Penetration testing performed

### HIPAA Compliance
- [ ] Risk assessment documented
- [ ] Business Associate Agreements (BAAs) signed with:
  - [ ] Hosting provider
  - [ ] Email provider (SendGrid)
  - [ ] SMS provider (Twilio)
  - [ ] Payment processor (Stripe)
  - [ ] Any other third-party service handling PHI
- [ ] Privacy Officer designated
- [ ] Security Officer designated
- [ ] HIPAA training completed for all staff
- [ ] Incident response plan documented
- [ ] Breach notification procedures in place
- [ ] Audit log retention policy configured (7+ years)
- [ ] Data backup and recovery procedures tested

### Infrastructure
- [ ] Database backups automated (encrypted, tested)
- [ ] Monitoring and alerting configured
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Log aggregation configured
- [ ] Disaster recovery plan tested
- [ ] Scaling strategy defined
- [ ] CDN configured for static assets
- [ ] Database connection pooling configured

## Deployment Options

### Option 1: AWS (Recommended for HIPAA)

#### Architecture
- **Compute**: ECS Fargate or EC2 (t3.medium minimum)
- **Database**: RDS PostgreSQL (Multi-AZ, encrypted)
- **Cache**: ElastiCache Redis
- **Storage**: S3 (encrypted, versioning enabled)
- **CDN**: CloudFront
- **Load Balancer**: Application Load Balancer (ALB)
- **Secrets**: AWS Secrets Manager
- **Monitoring**: CloudWatch + CloudTrail

#### Steps

1. **Set up VPC**
```bash
# Private subnets for database and application
# Public subnets for load balancer
# NAT Gateway for outbound traffic
```

2. **Create RDS PostgreSQL**
```bash
# Use db.t3.medium or larger
# Enable encryption at rest
# Enable automated backups (30-day retention)
# Enable Multi-AZ deployment
# Configure SSL/TLS
```

3. **Create ElastiCache Redis**
```bash
# Use cache.t3.micro or larger
# Enable encryption in transit and at rest
# Enable automatic failover
```

4. **Set up S3 Bucket**
```bash
# Enable default encryption (AES-256 or KMS)
# Enable versioning
# Configure lifecycle policies
# Block public access
# Enable access logging
```

5. **Deploy Application**

Using ECS Fargate:
```bash
# Build Docker image
docker build -t mediflow:latest .

# Push to ECR
aws ecr create-repository --repository-name mediflow
docker tag mediflow:latest <account>.dkr.ecr.us-east-1.amazonaws.com/mediflow:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/mediflow:latest

# Create ECS cluster and service
aws ecs create-cluster --cluster-name mediflow-cluster
# Configure task definition with environment variables
# Set up service with ALB
```

6. **Configure Environment Variables**
```bash
# Store in AWS Secrets Manager
aws secretsmanager create-secret \
  --name mediflow/production \
  --secret-string '{
    "DATABASE_URL": "postgresql://...",
    "JWT_SECRET": "...",
    "ENCRYPTION_KEY": "..."
  }'
```

7. **Set up CloudFront**
```bash
# Create distribution
# Configure SSL certificate (ACM)
# Set up cache behaviors
# Enable logging
```

8. **Configure CloudWatch**
```bash
# Set up alarms for:
# - High CPU usage
# - High memory usage
# - Database connections
# - Failed login attempts
# - API errors
```

#### Estimated Monthly Cost (AWS)
- ECS Fargate (2 tasks): ~$100
- RDS db.t3.medium (Multi-AZ): ~$150
- ElastiCache cache.t3.micro: ~$25
- S3 storage (100GB): ~$3
- Data transfer: ~$50
- **Total: ~$330/month**

### Option 2: Google Cloud Platform

#### Services
- **Compute**: Cloud Run or GKE
- **Database**: Cloud SQL (PostgreSQL)
- **Cache**: Memorystore (Redis)
- **Storage**: Cloud Storage
- **CDN**: Cloud CDN
- **Secrets**: Secret Manager

### Option 3: Azure

#### Services
- **Compute**: App Service or Container Instances
- **Database**: Azure Database for PostgreSQL
- **Cache**: Azure Cache for Redis
- **Storage**: Blob Storage
- **CDN**: Azure CDN
- **Secrets**: Key Vault

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npm run db:generate
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose (for testing)
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://mediflow:password@db:5432/mediflow
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=mediflow
      - POSTGRES_USER=mediflow
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Environment Variables for Production

```env
# Application
NODE_ENV=production
APP_URL=https://your-domain.com
APP_NAME=MediFlow

# Database (use connection pooling)
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public&connection_limit=20&pool_timeout=20

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<64-character-random-string>
JWT_SECRET=<64-character-random-string>

# Encryption
ENCRYPTION_KEY=<32-character-random-string>
ENCRYPTION_IV=<16-character-random-string>

# Redis
REDIS_URL=redis://:<password>@your-redis-host:6379

# Email (SendGrid with BAA)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid-api-key>
FROM_EMAIL=noreply@your-domain.com

# SMS (Twilio with BAA)
TWILIO_ACCOUNT_SID=<twilio-account-sid>
TWILIO_AUTH_TOKEN=<twilio-auth-token>
TWILIO_PHONE_NUMBER=+1234567890

# Payment (Stripe with BAA)
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>

# AWS (if using)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
AWS_S3_BUCKET=mediflow-documents

# Monitoring
SENTRY_DSN=<sentry-dsn>

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
SESSION_TIMEOUT=30
MAX_SESSION_AGE=8

# Audit
AUDIT_LOG_RETENTION_DAYS=2555
```

## Database Migration

```bash
# Run migrations
npm run db:migrate

# Verify
npm run db:studio
```

## Post-Deployment Steps

### 1. Verify Deployment
```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Check database connection
curl https://your-domain.com/api/health/db

# Test authentication
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mediflow.com","password":"your-password"}'
```

### 2. Configure DNS
- Point domain to load balancer
- Set up www redirect
- Configure SPF, DKIM, DMARC for email

### 3. Set up SSL/TLS
- Use Let's Encrypt or AWS Certificate Manager
- Enforce HTTPS (redirect HTTP to HTTPS)
- Enable HSTS header

### 4. Configure Monitoring
- Set up uptime monitoring (Pingdom, StatusCake)
- Configure error tracking (Sentry)
- Set up log aggregation (ELK, Datadog)
- Configure application monitoring (New Relic, Datadog)

### 5. Set up Backups
- Automated daily database backups
- Weekly full backups
- Monthly archives
- Test restoration procedure
- Store backups encrypted in separate region

### 6. Security Hardening
- Run security scan (OWASP ZAP, Burp Suite)
- Configure WAF rules
- Set up intrusion detection
- Enable audit logging
- Configure fail2ban (if using VMs)

### 7. Performance Optimization
- Enable database query caching
- Configure CDN caching
- Enable Redis session storage
- Optimize images
- Enable compression (gzip/brotli)

## Monitoring & Alerting

### Key Metrics to Monitor
- **Application**:
  - Response time (p50, p95, p99)
  - Error rate
  - Requests per second
  - Active users

- **Database**:
  - Connection count
  - Query performance
  - Replication lag (if using read replicas)
  - Storage utilization

- **Security**:
  - Failed login attempts
  - Unauthorized access attempts
  - PHI access patterns
  - API rate limit violations

### Alert Thresholds
- Error rate > 1%
- Response time p95 > 2 seconds
- Database connections > 80%
- Failed logins > 10 per minute
- Disk usage > 80%

## Disaster Recovery

### RTO (Recovery Time Objective): 4 hours
### RPO (Recovery Point Objective): 1 hour

### Backup Strategy
1. **Continuous**: Transaction logs (WAL) to S3
2. **Hourly**: Incremental backups
3. **Daily**: Full database backups
4. **Weekly**: Application snapshots
5. **Monthly**: Long-term archives

### Recovery Procedures
1. Restore from most recent backup
2. Replay transaction logs
3. Verify data integrity
4. Update DNS if needed
5. Notify users

## Scaling Strategy

### Vertical Scaling (Day 1-100 patients)
- Increase instance size
- Upgrade database tier

### Horizontal Scaling (100+ concurrent users)
- Add application instances
- Use read replicas for database
- Implement CDN caching
- Use Redis for session storage

### Database Optimization
- Add indexes based on query patterns
- Implement connection pooling
- Use materialized views for reports
- Consider read replicas

## Maintenance Windows

- **Preferred**: Sundays 2-6 AM local time
- **Frequency**: Monthly for updates
- **Notification**: 1 week advance notice

## Support & SLA

- **Uptime Target**: 99.9% (8.76 hours downtime/year)
- **Response Times**:
  - Critical: 1 hour
  - High: 4 hours
  - Medium: 24 hours
  - Low: 72 hours

## Cost Optimization

- Use Reserved Instances (AWS) or Committed Use Discounts (GCP)
- Implement auto-scaling
- Use S3 lifecycle policies for old data
- Monitor and optimize unused resources
- Use CloudWatch/Stackdriver for cost analysis

## Compliance Maintenance

- **Quarterly**: Review access logs
- **Bi-annually**: Security audit
- **Annually**: HIPAA compliance review
- **Continuous**: Patch management

---

## Emergency Contacts

- **Technical Lead**: technical@mediflow.com
- **Security Officer**: security@mediflow.com
- **On-Call**: +1-555-ONCALL
- **AWS Support**: Via AWS Console
- **Database DBA**: dba@mediflow.com

---

**Last Updated**: [Date]
**Next Review**: [Date + 6 months]
