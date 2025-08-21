# How to Check Railway Logs

## **🔍 Step-by-Step Guide:**

### **1. Go to Your ai_chatbot Service**
1. Click on the **ai_chatbot service card** (the one with red X)
2. This takes you to the service dashboard

### **2. Check Deployment Logs**
1. Click on **"Deployments"** tab
2. Click on the **latest deployment** (the failed one)
3. Look at the **"Logs"** section

### **3. What to Look For**
The logs will show you exactly why it's failing. Common issues:

**Missing Environment Variables:**
```
❌ Database connection failed: connect ECONNREFUSED
❌ Error: Cannot find module 'dotenv'
❌ Error: DB_HOST is not defined
```

**Database Connection Issues:**
```
❌ Database connection failed: connect ECONNREFUSED ::1:3306
❌ Access denied for user 'root'@'localhost'
```

**Port Issues:**
```
❌ EADDRINUSE: address already in use :::3000
```

### **4. Share the Error Message**
Copy the error message from the logs and share it with me. This will tell us exactly what's wrong.

## **🚀 Quick Fix Checklist:**

- [ ] Added DB_HOST environment variable
- [ ] Added DB_PORT environment variable  
- [ ] Added DB_NAME environment variable
- [ ] Added DB_USER environment variable
- [ ] Added DB_PASSWORD environment variable
- [ ] Added PORT environment variable
- [ ] Added NODE_ENV environment variable
- [ ] Added WhatsApp credentials (optional for now)

## **📞 Need Help?**
Share the error message from the logs and I'll help you fix it!
