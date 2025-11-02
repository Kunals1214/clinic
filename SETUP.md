# MediFlow - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **Redis** (optional, for caching) ([Download](https://redis.io/download))

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd clinic
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Prisma ORM
- TypeScript
- Tailwind CSS
- And all other dependencies

### 3. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:

```sql
CREATE DATABASE mediflow;
CREATE USER mediflow_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE mediflow TO mediflow_user;
```

#### Option B: Docker PostgreSQL

```bash
docker run --name mediflow-postgres \
  -e POSTGRES_DB=mediflow \
  -e POSTGRES_USER=mediflow_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://mediflow_user:your_secure_password@localhost:5432/mediflow?schema=public"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
JWT_SECRET="generate-another-secure-random-string"

# Encryption (IMPORTANT: Use secure random keys in production)
ENCRYPTION_KEY="generate-32-character-key-here"
ENCRYPTION_IV="16-character-iv-key"

# Redis (optional)
REDIS_URL="redis://localhost:6379"

# Email (SendGrid - optional for now)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
FROM_EMAIL="noreply@mediflow.com"

# SMS (Twilio - optional for now)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Application
NODE_ENV="development"
APP_URL="http://localhost:3000"
```

**⚠️ IMPORTANT: Generate Secure Keys**

To generate secure random keys, use Node.js:

```javascript
// In Node.js console or create a temp script
const crypto = require('crypto');

// For NEXTAUTH_SECRET and JWT_SECRET (64 characters)
console.log('NEXTAUTH_SECRET:', crypto.randomBytes(32).toString('hex'));
console.log('JWT_SECRET:', crypto.randomBytes(32).toString('hex'));

// For ENCRYPTION_KEY (32 characters for AES-256)
console.log('ENCRYPTION_KEY:', crypto.randomBytes(16).toString('hex'));

// For ENCRYPTION_IV (16 characters)
console.log('ENCRYPTION_IV:', crypto.randomBytes(8).toString('hex'));
```

### 5. Set Up the Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 6. (Optional) Seed the Database

```bash
npm run db:seed
```

This will create:
- Sample users with different roles
- Test patients
- Sample appointments
- Test data for development

### 7. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 8. Access the Application

**Landing Page**: http://localhost:3000

**Default Admin Credentials** (if seeded):
- Email: `admin@mediflow.com`
- Password: `Admin@12345678`

**Default Doctor Credentials**:
- Email: `doctor@mediflow.com`
- Password: `Doctor@12345678`

**⚠️ IMPORTANT**: Change these default passwords immediately in production!

## Verification Steps

### 1. Check Database Connection

```bash
# Open Prisma Studio to view database
npm run db:studio
```

This opens a GUI at http://localhost:5555 to view your database tables.

### 2. Verify Authentication

1. Go to http://localhost:3000/login
2. Try logging in with default credentials
3. Verify MFA setup (if enabled)

### 3. Test Patient Creation

1. Navigate to Patients section
2. Create a new patient
3. Verify data appears in database

### 4. Check Audit Logs

1. Perform some actions (view patient, create appointment)
2. Check `audit_logs` table in Prisma Studio
3. Verify all actions are logged

## Common Issues & Solutions

### Issue: "Database connection failed"

**Solution**: 
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists and user has permissions

### Issue: "Prisma Client not generated"

**Solution**:
```bash
npm run db:generate
```

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Use a different port
PORT=3001 npm run dev
```

Or kill the process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module not found" errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Encryption/Decryption errors"

**Solution**:
- Ensure ENCRYPTION_KEY is exactly 32 characters
- Ensure ENCRYPTION_IV is exactly 16 characters
- Never change these keys after encrypting data (you'll lose access to encrypted data)

## Development Workflow

### 1. Making Database Changes

When you modify `prisma/schema.prisma`:

```bash
# For development (quick)
npm run db:push

# For production (creates migration)
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### 2. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

### 3. Code Formatting

```bash
# Run ESLint
npm run lint

# Format code (if Prettier is configured)
npm run format
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

## Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong, unique secrets for JWT, encryption
- [ ] Enable HTTPS/TLS
- [ ] Configure PostgreSQL with SSL
- [ ] Set up automated encrypted backups
- [ ] Enable MFA for all admin accounts
- [ ] Review and configure HIPAA compliance settings
- [ ] Set up monitoring and alerting
- [ ] Configure WAF and DDoS protection
- [ ] Complete security audit
- [ ] Set up audit log retention (7+ years)

## Getting Help

- **Documentation**: See README.md
- **Issues**: GitHub Issues
- **Security**: security@mediflow.com
- **Support**: support@mediflow.com

## Next Steps

1. ✅ Complete setup
2. 📖 Read the [User Guide](./docs/USER_GUIDE.md)
3. 🔐 Review [Security Guidelines](./docs/SECURITY.md)
4. 📊 Explore [API Documentation](./docs/API.md)
5. 🏥 Configure [HIPAA Compliance](./docs/HIPAA.md)

---

**Congratulations! Your MediFlow instance is now running.**

For questions or issues, please refer to the documentation or contact support.
