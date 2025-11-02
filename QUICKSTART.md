# MediFlow - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed
- Git installed

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your PostgreSQL connection
# DATABASE_URL="postgresql://username:password@localhost:5432/mediflow"

# Push database schema
npm run db:push

# Seed with test data
npm run db:seed
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access the Application
Open [http://localhost:3000](http://localhost:3000)

**Default Login Credentials:**
- Email: `admin@mediflow.com`
- Password: `Admin@12345678`

---

## 📚 Key Features to Try

### 1. Patient Management
- Navigate to `/dashboard/patients`
- Click "Add Patient" to register a new patient
- Search patients by name, MRN, or phone
- View complete patient profiles

### 2. Appointments
- Go to `/dashboard/appointments`
- Schedule appointments with providers
- View daily/weekly/monthly calendar
- Check-in patients

### 3. Electronic Health Records
- Open a patient profile
- Click "Medical Records" tab
- Record vitals, diagnoses, medications
- View historical records

### 4. E-Prescribing
- From patient profile, click "Prescribe"
- Search medication database
- Check drug interactions
- Send to pharmacy

### 5. Analytics Dashboard
- Visit `/dashboard/analytics`
- View real-time KPIs
- Check revenue reports
- Monitor patient demographics

---

## 🔐 Security Features

### Change Default Passwords
```sql
-- In production, immediately change default passwords!
UPDATE users SET password_hash = '<new-hashed-password>' 
WHERE email = 'admin@mediflow.com';
```

### Enable MFA
1. Go to User Settings
2. Enable Two-Factor Authentication
3. Scan QR code with authenticator app
4. Enter verification code

### Review Audit Logs
```bash
# View in Prisma Studio
npm run db:studio

# Navigate to audit_logs table
```

---

## 📊 Database Overview

### Key Tables
- **users** - User accounts (8 created by seed)
- **patients** - Patient records (2 sample patients)
- **providers** - Healthcare providers (1 doctor)
- **appointments** - Scheduled appointments (2 upcoming)
- **medical_records** - EHR data
- **audit_logs** - Complete audit trail

### Access Database
```bash
# Open Prisma Studio
npm run db:studio
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test API Endpoints
```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mediflow.com","password":"Admin@12345678"}'

# Test patient creation (use token from login)
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{...patient-data...}'
```

---

## 📖 Learn More

- **Full Setup Guide**: [SETUP.md](./SETUP.md)
- **API Documentation**: [README.md](./README.md#-api-documentation)
- **Security Guidelines**: [README.md](./README.md#-security-features)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🆘 Common Issues

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify DATABASE_URL in .env
```

### "Prisma Client not found"
```bash
npm run db:generate
```

### "Port 3000 already in use"
```bash
# Use different port
PORT=3001 npm run dev
```

---

## 🎯 Next Steps

1. ✅ Complete initial setup
2. 📖 Read comprehensive [README.md](./README.md)
3. 🔐 Review security best practices
4. 🏥 Configure HIPAA compliance settings
5. 📊 Set up monitoring and backups
6. 🚀 Deploy to production (see [DEPLOYMENT.md](./DEPLOYMENT.md))

---

**Need Help?**
- Documentation: See README.md
- Issues: GitHub Issues
- Email: support@mediflow.com

---

**Happy Healing! 🏥❤️**
