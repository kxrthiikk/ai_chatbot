# Railway Environment Variables for Your App

## **📋 Copy These Variables to Your Main Service**

Go to your **main service** (Node.js app) in Railway dashboard → **"Variables"** tab and add these variables:

### **Database Configuration:**
```
DB_HOST=mysql-production-fb4ac.up.railway.app
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=SZlJMOfAGpQNJCaFVpSWGXIvveDyeZtf
```

### **Server Configuration:**
```
PORT=3000
NODE_ENV=production
```

### **WhatsApp Configuration (You need to add these):**
```
WHATSAPP_TOKEN=your-whatsapp-token-here
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id-here
```

## **🔧 Complete JSON for Railway Variables:**

```json
{
  "DB_HOST": "mysql-production-fb4ac.up.railway.app",
  "DB_PORT": "3306",
  "DB_NAME": "railway",
  "DB_USER": "root",
  "DB_PASSWORD": "SZlJMOfAGpQNJCaFVpSWGXIvveDyeZtf",
  "PORT": "3000",
  "NODE_ENV": "production",
  "WHATSAPP_TOKEN": "your-whatsapp-token-here",
  "WHATSAPP_PHONE_NUMBER_ID": "your-phone-number-id-here"
}
```

## **🚀 How to Add These Variables:**

1. **Go to your main service** (the Node.js app, not the MySQL service)
2. **Click "Variables" tab**
3. **Click "New Variable"** for each one
4. **Add them one by one:**

### **Step 1: Add Database Variables**
- **Variable Name:** `DB_HOST`
- **Value:** `mysql-production-fb4ac.up.railway.app`

- **Variable Name:** `DB_PORT`
- **Value:** `3306`

- **Variable Name:** `DB_NAME`
- **Value:** `railway`

- **Variable Name:** `DB_USER`
- **Value:** `root`

- **Variable Name:** `DB_PASSWORD`
- **Value:** `SZlJMOfAGpQNJCaFVpSWGXIvveDyeZtf`

### **Step 2: Add Server Variables**
- **Variable Name:** `PORT`
- **Value:** `3000`

- **Variable Name:** `NODE_ENV`
- **Value:** `production`

### **Step 3: Add WhatsApp Variables**
- **Variable Name:** `WHATSAPP_TOKEN`
- **Value:** `your-actual-whatsapp-token`

- **Variable Name:** `WHATSAPP_PHONE_NUMBER_ID`
- **Value:** `your-actual-phone-number-id`

## **⚠️ Important Notes:**

1. **Replace the WhatsApp credentials** with your actual values from Meta Developer Console
2. **After adding all variables**, Railway will automatically redeploy
3. **The deployment should succeed** once all variables are set correctly

## **🚀 Next Steps:**

1. Add all the variables above to your main service
2. Wait for Railway to redeploy
3. Check the deployment logs
4. Once successful, you'll get a public URL for your webhook
