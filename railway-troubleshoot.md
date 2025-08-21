# Railway Deployment Troubleshooting

## Current Issue: Service Unavailable Errors

The deployment is failing because the application can't start properly. Here are the most likely causes and solutions:

## **🔧 Step 1: Check Railway Logs**

1. Go to your Railway dashboard
2. Click on your project
3. Go to the "Deployments" tab
4. Click on the latest deployment
5. Check the "Logs" section for error messages

## **🔧 Step 2: Set Environment Variables**

The most common cause is missing environment variables. You need to set these in Railway:

### **Required Environment Variables:**

1. **Database Configuration:**
   ```
   DB_HOST=your-mysql-host
   DB_USER=your-mysql-username
   DB_PASSWORD=your-mysql-password
   DB_NAME=whatsapp_bot
   DB_PORT=3306
   ```

2. **WhatsApp Configuration:**
   ```
   WHATSAPP_TOKEN=your-whatsapp-token
   WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
   ```

3. **Server Configuration:**
   ```
   PORT=3000
   NODE_ENV=production
   ```

## **🔧 Step 3: How to Set Environment Variables in Railway**

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Variables" tab
4. Click "New Variable"
5. Add each variable one by one

## **🔧 Step 4: Database Setup Options**

### **Option A: Use Railway's MySQL Plugin**
1. In Railway dashboard, click "New"
2. Select "Database" → "MySQL"
3. Copy the connection details to your environment variables

### **Option B: Use External Database**
- Use your existing XAMPP MySQL (requires public access)
- Or use a cloud MySQL service (PlanetScale, AWS RDS, etc.)

## **🔧 Step 5: Quick Fix - Use Railway's Built-in Database**

Let's set up a Railway MySQL database and update the environment variables:

1. **Add MySQL Database:**
   - In Railway dashboard, click "New"
   - Select "Database" → "MySQL"
   - Wait for it to provision

2. **Get Connection Details:**
   - Click on the MySQL service
   - Go to "Connect" tab
   - Copy the connection details

3. **Update Environment Variables:**
   - Go back to your main service
   - Update the DB_* variables with the new connection details

## **🔧 Step 6: Test the Fix**

After setting environment variables:
1. Railway will automatically redeploy
2. Check the logs again
3. The service should start successfully

## **🔧 Step 7: Alternative - Use Railway's Development Environment**

If you want to test locally first:
1. Install Railway CLI: `npm install -g @railway/cli`
2. Run: `railway login`
3. Run: `railway link`
4. Run: `railway up`

This will deploy from your local environment and show detailed logs.
