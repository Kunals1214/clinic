# 🚀 Quick PostgreSQL Setup for MediFlow

## Current Status
✅ Dependencies installed
✅ Development server running (http://localhost:3000)
✅ Environment variables configured (.env created)
❌ PostgreSQL database not connected yet

---

## Next Step: Set Up PostgreSQL Database

You have **3 options** to get PostgreSQL running:

### Option 1: Install PostgreSQL Locally (Recommended for Development)

1. **Download PostgreSQL 14+**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the Windows installer
   - Run the installer

2. **During Installation:**
   - Set password for `postgres` user (remember this!)
   - Port: `5432` (default)
   - Locale: Default

3. **After Installation:**
   ```powershell
   # Test if PostgreSQL is running
   Get-Service -Name "*postgresql*"
   
   # Should show Status: Running
   ```

4. **Create the Database:**
   ```powershell
   # Connect to PostgreSQL
   psql -U postgres
   
   # In psql, create the database:
   CREATE DATABASE mediflow;
   \q
   ```

5. **Update .env file** (if you used a different password):
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mediflow?schema=public"
   ```

6. **Push the schema to database:**
   ```powershell
   npm run db:push
   ```

7. **Seed sample data:**
   ```powershell
   npm run db:seed
   ```

---

### Option 2: Use Docker (Easiest!)

If you have Docker Desktop installed:

```powershell
# Start PostgreSQL in Docker
docker run --name mediflow-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=mediflow `
  -p 5432:5432 `
  -d postgres:14

# Verify it's running
docker ps

# Now run:
npm run db:push
npm run db:seed
```

---

### Option 3: Use Supabase (Free Cloud PostgreSQL)

1. **Sign up at:** https://supabase.com
2. **Create a new project**
3. **Get your connection string** from Project Settings > Database
4. **Update .env:**
   ```
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
5. **Run:**
   ```powershell
   npm run db:push
   npm run db:seed
   ```

---

## Once Database is Connected

You'll be able to:

1. ✅ **Login to the system:**
   - URL: http://localhost:3000
   - Email: `admin@mediflow.com`
   - Password: `Admin@12345678`

2. ✅ **Test other accounts:**
   - Doctor: `doctor@mediflow.com` / `Doctor@12345678`
   - Nurse: `nurse@mediflow.com` / `Nurse@12345678`
   - Receptionist: `receptionist@mediflow.com` / `Receptionist@12345678`

3. ✅ **Explore sample data:**
   - 2 sample patients
   - 2 scheduled appointments
   - Vital signs records
   - Medications and allergies

---

## Troubleshooting

### "Authentication failed" error
- Check if PostgreSQL is running
- Verify username/password in .env
- Test connection: `psql -U postgres -h localhost`

### Port 5432 already in use
- Another PostgreSQL instance is running
- Change port in .env to 5433 or different port

### "prisma" command not found
```powershell
npm install
```

---

## Commands Reference

```powershell
# Database operations
npm run db:push          # Create/update database tables
npm run db:seed          # Add sample data
npm run db:studio        # Open Prisma Studio (GUI)
npm run db:reset         # Reset database (WARNING: deletes all data)

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Code quality
npm run lint             # Check for code issues
npm run type-check       # TypeScript validation
npm run format           # Format code
```

---

## What's Next After Database Setup?

1. **Test the Application**
   - Login with admin credentials
   - Explore the landing page
   - Test API endpoints with Postman/Thunder Client

2. **Build UI Pages** (Next priority)
   - Login page at `/login`
   - Dashboard at `/dashboard`
   - Patient management UI
   - Appointment calendar
   - EHR interface

3. **Integrate External Services**
   - Email (SendGrid)
   - SMS (Twilio)
   - Payments (Stripe)
   - Telemedicine (Twilio Video)

---

## Need Help?

- **Documentation:** Check README.md and SETUP.md
- **Database Issues:** See SETUP.md "Database Setup" section
- **API Testing:** Use the API endpoints in /api/* routes
- **Prisma Studio:** Run `npm run db:studio` for a visual database browser

---

**Current Time:** October 31, 2025
**Your Location:** C:\Users\Acer\Downloads\turf-main\clinic
**Dev Server:** Running on http://localhost:3000
**Status:** Ready for database connection! 🎉
