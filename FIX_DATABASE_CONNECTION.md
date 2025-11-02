# 🔧 Quick Fix: PostgreSQL Connection

## Problem
PostgreSQL is running but the password in `.env` doesn't match your PostgreSQL installation.

## Solution Options

### Option 1: Find Your PostgreSQL Password (Quickest)

Your PostgreSQL 17 is already running! You just need the correct password.

**If you remember the password:**
1. Edit `.env` file
2. Update this line:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/mediflow?schema=public"
   ```
3. Replace `postgres` (after the second `:`) with your actual password

**Don't remember the password?** Try Option 2 or 3 below.

---

### Option 2: Use Docker Instead (Recommended - No Password Issues)

Stop your PostgreSQL service and use Docker:

```powershell
# Stop the Windows PostgreSQL service
Stop-Service postgresql-x64-17

# Start PostgreSQL in Docker with known credentials
docker run --name mediflow-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=mediflow `
  -p 5432:5432 `
  -d postgres:14

# Your .env is already configured for this!
# Now run:
npm run db:push
npm run db:seed
```

---

### Option 3: Reset PostgreSQL Password

If you want to use your Windows PostgreSQL:

1. **Find pg_hba.conf** (usually in `C:\Program Files\PostgreSQL\17\data\`)

2. **Edit pg_hba.conf** - Change this line:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
   To:
   ```
   host    all             all             127.0.0.1/32            trust
   ```

3. **Restart PostgreSQL:**
   ```powershell
   Restart-Service postgresql-x64-17
   ```

4. **Create database (no password needed now):**
   ```powershell
   psql -U postgres -c "CREATE DATABASE mediflow;"
   ```

5. **Change password:**
   ```powershell
   psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"
   ```

6. **Revert pg_hba.conf** back to `scram-sha-256`

7. **Restart again:**
   ```powershell
   Restart-Service postgresql-x64-17
   ```

8. **Test connection:**
   ```powershell
   npm run db:push
   ```

---

### Option 4: Try Common Passwords

Your PostgreSQL might be using one of these common passwords. Edit `.env` and try:

```env
# Try these one by one:
DATABASE_URL="postgresql://postgres:admin@localhost:5432/mediflow?schema=public"
DATABASE_URL="postgresql://postgres:root@localhost:5432/mediflow?schema=public"
DATABASE_URL="postgresql://postgres:password@localhost:5432/mediflow?schema=public"
DATABASE_URL="postgresql://postgres:1234@localhost:5432/mediflow?schema=public"
```

After each change, run:
```powershell
npm run db:push
```

---

## Quick Test Script

Create a file called `test-db.ps1` with this content:

```powershell
# Test database connection
$passwords = @("postgres", "admin", "root", "password", "1234", "")

foreach ($pwd in $passwords) {
    Write-Host "Testing password: $pwd" -ForegroundColor Yellow
    $env:PGPASSWORD = $pwd
    psql -U postgres -h localhost -c "SELECT version();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS! Password is: $pwd" -ForegroundColor Green
        Write-Host "Update your .env file with:"
        Write-Host "DATABASE_URL=`"postgresql://postgres:$pwd@localhost:5432/mediflow?schema=public`"" -ForegroundColor Cyan
        break
    }
}
```

Run it:
```powershell
.\test-db.ps1
```

---

## Recommended: Use Docker (Easiest!)

**Why Docker?**
- ✅ No password issues
- ✅ Clean isolated database
- ✅ Easy to reset
- ✅ Already configured in .env

**Install Docker Desktop:**
1. Download from https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Run the Docker command from Option 2 above

---

## After Database Connection Works

Once you can connect, run:

```powershell
# Create all tables
npm run db:push

# Add sample data (4 users, 2 patients, appointments)
npm run db:seed

# Open visual database browser
npm run db:studio
```

Then login at http://localhost:3000/login:
- Email: `admin@mediflow.com`
- Password: `Admin@12345678`

---

## Current Status

✅ PostgreSQL 17 is running  
✅ Development server is running (http://localhost:3000)  
✅ All UI pages created  
✅ All code implemented  
❌ Just need to connect to database!

**You're 1 step away from having a fully functional system!** 🎉

---

## Need Help?

If none of these work:
1. Check PostgreSQL installation password (you set it during installation)
2. Check Windows Credential Manager for saved PostgreSQL passwords
3. Contact your system administrator
4. Or just use Docker - it's the easiest way!

**Recommended: Go with Docker Option 2 above!**
