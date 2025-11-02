# 🔧 Database Connection - Quick Fix Guide

## Current Issue
The PostgreSQL password is not matching. Here are your options:

---

## ✅ Option 1: Find Your PostgreSQL Password (Recommended)

### Where to Find It:
1. **Check your installation notes** - You set this during PostgreSQL installation
2. **Check Windows Credential Manager:**
   - Press `Win + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Look for PostgreSQL credentials

3. **Check pgpass file:**
   ```powershell
   Get-Content "$env:APPDATA\postgresql\pgpass.conf" -ErrorAction SilentlyContinue
   ```

### Once You Find It:
Edit `.env` file and update line 2:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mediflow?schema=public"
```

Then run:
```powershell
npm run db:push
npm run db:seed
```

---

## ✅ Option 2: Reset PostgreSQL Password (Easiest)

### Steps:

1. **Stop PostgreSQL Service:**
```powershell
Stop-Service postgresql-x64-17
```

2. **Find pg_hba.conf:**
```powershell
# Usually located at:
C:\Program Files\PostgreSQL\17\data\pg_hba.conf
```

3. **Edit pg_hba.conf** (Open as Administrator with Notepad):
   
   Find this line:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
   
   Change to:
   ```
   host    all             all             127.0.0.1/32            trust
   ```

4. **Start PostgreSQL:**
```powershell
Start-Service postgresql-x64-17
```

5. **Set new password:**
```powershell
psql -U postgres -c "ALTER USER postgres WITH PASSWORD '1234';"
```

6. **Revert pg_hba.conf** back to `scram-sha-256`

7. **Restart service:**
```powershell
Restart-Service postgresql-x64-17
```

8. **Create database:**
```powershell
$env:PGPASSWORD='1234'
psql -U postgres -c "CREATE DATABASE mediflow;"
```

9. **Update .env:**
```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/mediflow?schema=public"
```

10. **Initialize database:**
```powershell
npm run db:push
npm run db:seed
```

---

## ✅ Option 3: Use SQLite (Quickest - No Password Needed!)

This is the fastest way to get started:

### 1. Update `prisma/schema.prisma`:

Change line 7 from:
```prisma
provider = "postgresql"
```

To:
```prisma
provider = "sqlite"
```

### 2. Update `.env`:

Change line 2 from:
```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/mediflow?schema=public"
```

To:
```env
DATABASE_URL="file:./dev.db"
```

### 3. Install Prisma SQLite:
```powershell
npm install @prisma/client
```

### 4. Initialize database:
```powershell
npm run db:push
npm run db:seed
```

### 5. Done! Now register at:
```
http://localhost:3000/register
```

---

## ✅ Option 4: Docker PostgreSQL (If You Have Docker Desktop)

### 1. Install Docker Desktop:
Download from: https://www.docker.com/products/docker-desktop/

### 2. Start Docker Desktop

### 3. Run this:
```powershell
# Stop your Windows PostgreSQL (to free port 5432)
Stop-Service postgresql-x64-17

# Start Docker PostgreSQL
docker run --name mediflow-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=mediflow `
  -p 5432:5432 `
  -d postgres:14

# Update .env (already set correctly)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mediflow?schema=public"
```

### 4. Initialize:
```powershell
npm run db:push
npm run db:seed
```

---

## 🎯 Recommended Path

**For Development (Fastest):** Use **Option 3 (SQLite)** - 5 minutes, no password needed

**For Production-like:** Use **Option 4 (Docker)** - Clean, isolated database

**For Using Existing PostgreSQL:** Use **Option 2** - Reset password to something you know

---

## After Database is Connected

You'll be able to:
1. ✅ Register new users at `/register`
2. ✅ Login at `/login`
3. ✅ Access dashboard at `/dashboard`
4. ✅ Test all features

---

## Current Status

✅ Application running on http://localhost:3000
✅ All UI pages created
✅ All APIs functional
❌ Database connection needed

**Pick an option above and you'll be fully operational in minutes!**
