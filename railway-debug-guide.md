# Railway Database Connection Debug Guide

## **🔍 Current Issue: Database Connection ETIMEDOUT**

Since changing the port to 3306 also failed, let's systematically debug this:

## **Step 1: Check MySQL Service Status**

1. **Go to your MySQL service** in Railway
2. **Check if it shows "Deployment successful"** ✅
3. **Go to MySQL service → "Connect" tab**
4. **Copy the exact connection details**

## **Step 2: Verify Environment Variables**

Make sure these are set correctly in your **ai_chatbot service**:

```
DB_HOST=mysql-production-fb4ac.up.railway.app
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=SZlJMOfAGpQNJCaFVpSWGXIvveDyeZtf
```

## **Step 3: Check MySQL Service Variables**

Go to your **MySQL service** → "Variables" tab and verify:
- `MYSQLHOST` should match your `DB_HOST`
- `MYSQLPORT` should be `3306`
- `MYSQLDATABASE` should be `railway`
- `MYSQLUSER` should be `root`

## **Step 4: Test Database Connection**

Let's create a simple database test:

```javascript
// Add this to your backend/index.js temporarily
const mysql = require('mysql2/promise');

async function testDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('✅ Direct connection successful');
    await connection.end();
  } catch (error) {
    console.error('❌ Direct connection failed:', error.message);
  }
}

testDB();
```

## **Step 5: Check Railway Network**

Railway services should be able to communicate internally. The issue might be:
1. **MySQL service not fully ready**
2. **Wrong internal hostname**
3. **Network connectivity issues**

## **Step 6: Alternative Approach**

Try using Railway's internal service discovery:
1. **Go to MySQL service → "Connect" tab**
2. **Use the internal connection details**
3. **Update your environment variables accordingly**

## **📞 Share These Details:**

1. **MySQL service status** (is it showing "Deployment successful"?)
2. **MySQL service "Connect" tab details**
3. **Latest deployment logs** after changing to port 3306
4. **Any new error messages**

This will help us identify the exact cause of the connection issue.
