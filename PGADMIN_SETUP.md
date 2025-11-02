# 🗄️ Setting Up MediFlow Database with pgAdmin

## Step-by-Step Instructions

### Step 1: Open pgAdmin
1. Press `Windows Key` and search for **pgAdmin**
2. Launch **pgAdmin 4**
3. It will open in your browser

### Step 2: Connect to PostgreSQL Server
1. In the left sidebar, expand **Servers**
2. Click on **PostgreSQL 17** (it may ask for a password)
3. Enter the password you set during PostgreSQL installation
4. If you don't remember it, see "Forgot Password?" section below

### Step 3: Create the Database
1. Right-click on **Databases** in the left sidebar
2. Select **Create** > **Database...**
3. In the dialog:
   - **Database name:** `mediflow`
   - **Owner:** `postgres`
   - Click **Save**

### Step 4: Find Your PostgreSQL Password

#### Option A: Check in pgAdmin
1. When you clicked on PostgreSQL 17 server, you entered a password
2. That's your password! Remember it.

#### Option B: It's saved in pgAdmin
1. Right-click on **PostgreSQL 17** server
2. Select **Properties**
3. Go to **Connection** tab
4. The password might be visible or saved

### Step 5: Update the .env File

1. Open the file: `C:\Users\Acer\Downloads\turf-main\clinic\.env`
2. Find line 2 (starts with `DATABASE_URL=`)
3. Replace it with (use YOUR password):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/mediflow?schema=public"
```

**Example:** If your password is `admin123`, the line should be:
```env
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/mediflow?schema=public"
```

### Step 6: Initialize the Database

Open PowerShell in your project folder and run:

```powershell
# Generate Prisma client
npm run db:generate

# Create all tables
npm run db:push

# Add sample data (4 users, 2 patients, appointments, etc.)
npm run db:seed
```

### Step 7: Verify in pgAdmin

1. In pgAdmin, right-click on **mediflow** database
2. Select **Refresh**
3. Expand **mediflow** > **Schemas** > **public** > **Tables**
4. You should see 16 tables created:
   - users
   - sessions
   - providers
   - patients
   - appointments
   - medical_records
   - vital_signs
   - allergies
   - medications
   - prescriptions
   - lab_orders
   - lab_results
   - billing
   - insurance_claims
   - documents
   - audit_logs
   - system_config

### Step 8: Test Registration

1. Go to: http://localhost:3000/register
2. Fill out the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@hospital.com`
   - Role: `Doctor`
   - Password: `MySecure@Pass123`
   - Confirm Password: `MySecure@Pass123`
3. Click **Create Account**
4. You should see "Registration Successful"

### Step 9: Login

1. Go to: http://localhost:3000/login
2. Use your credentials:
   - Email: `john.doe@hospital.com`
   - Password: `MySecure@Pass123`
3. Click **Sign In**
4. You'll be redirected to the dashboard

---

## 🔧 Troubleshooting

### "Forgot Password?" - Reset PostgreSQL Password

1. **Find pg_hba.conf:**
   - Located at: `C:\Program Files\PostgreSQL\17\data\pg_hba.conf`

2. **Open as Administrator** (right-click > Run as Administrator) with Notepad

3. **Find this line:**
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

4. **Change to:**
   ```
   host    all             all             127.0.0.1/32            trust
   ```

5. **Restart PostgreSQL:**
   ```powershell
   Restart-Service postgresql-x64-17
   ```

6. **Open pgAdmin** - You can now connect without a password

7. **Set a new password:**
   - In pgAdmin, expand **PostgreSQL 17**
   - Right-click **Login/Group Roles** > **postgres**
   - Go to **Definition** tab
   - Enter new password: `1234` (or your choice)
   - Click **Save**

8. **Revert pg_hba.conf** back to `scram-sha-256`

9. **Restart PostgreSQL again:**
   ```powershell
   Restart-Service postgresql-x64-17
   ```

10. **Update .env:**
    ```env
    DATABASE_URL="postgresql://postgres:1234@localhost:5432/mediflow?schema=public"
    ```

---

## 🎯 Quick Test Credentials

After running `npm run db:seed`, you can login with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mediflow.com | Admin@12345678 |
| Doctor | doctor@mediflow.com | Doctor@12345678 |
| Nurse | nurse@mediflow.com | Nurse@12345678 |
| Receptionist | receptionist@mediflow.com | Receptionist@12345678 |

---

## ✅ Success Checklist

- [ ] pgAdmin opened and connected
- [ ] `mediflow` database created
- [ ] Password found/set
- [ ] `.env` file updated with correct password
- [ ] `npm run db:push` completed successfully
- [ ] `npm run db:seed` added sample data
- [ ] Can register new users at `/register`
- [ ] Can login at `/login`
- [ ] Can access dashboard at `/dashboard`

---

## 📞 Still Having Issues?

If you're still stuck, tell me:
1. What error message you see in pgAdmin
2. What happens when you run `npm run db:push`
3. The error message from the registration page

I'll help you resolve it!
