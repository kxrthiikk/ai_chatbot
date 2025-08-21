# Railway Environment Variables Setup

## **🚀 Quick Setup Guide**

### **Step 1: Add MySQL Database to Railway**

1. Go to your Railway project dashboard
2. Click the **"New"** button
3. Select **"Database"** → **"MySQL"**
4. Wait for it to provision (usually 1-2 minutes)

### **Step 2: Get Database Connection Details**

1. Click on the **MySQL service** in your project
2. Go to the **"Connect"** tab
3. Copy these values:
   - **Host**: `MYSQLHOST`
   - **Port**: `MYSQLPORT` (usually 3306)
   - **Database**: `MYSQLDATABASE`
   - **Username**: `MYSQLUSER`
   - **Password**: `MYSQLPASSWORD`

### **Step 3: Set Environment Variables**

1. Go back to your **main service** (the Node.js app)
2. Click on the **"Variables"** tab
3. Add these variables one by one:

```
DB_HOST=MYSQLHOST (from step 2)
DB_PORT=MYSQLPORT (from step 2)
DB_NAME=MYSQLDATABASE (from step 2)
DB_USER=MYSQLUSER (from step 2)
DB_PASSWORD=MYSQLPASSWORD (from step 2)
PORT=3000
NODE_ENV=production
```

### **Step 4: Add WhatsApp Variables**

You'll also need to add your WhatsApp credentials:

```
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

### **Step 5: Redeploy**

After adding all variables:
1. Railway will automatically redeploy
2. Check the **"Deployments"** tab
3. The service should start successfully

## **🔍 Troubleshooting**

If it still fails:
1. Check the **"Logs"** in the latest deployment
2. Make sure all environment variables are set correctly
3. Verify the database connection details

## **📞 Need Help?**

If you're still having issues, share the error logs from Railway and I'll help you debug further!
