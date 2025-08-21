# Railway Environment Variables Setup

## **🔧 Updated Environment Variables for ai_chatbot Service**

Go to your **ai_chatbot service** → **Variables tab** and set these variables:

### **Database Configuration (Use Railway's Internal Discovery)**
```
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_NAME=${{MYSQLDATABASE}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
```

### **Application Configuration**
```
PORT=3000
NODE_ENV=production
```

### **WhatsApp Configuration**
```
WHATSAPP_TOKEN=your_whatsapp_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
```

## **🎯 Key Changes:**
1. **Using Railway's internal variables** (`${{MYSQLHOST}}`, etc.) instead of direct values
2. **This enables internal service discovery** within Railway's network
3. **Faster and more reliable connections** between services

## **📋 Steps:**
1. **Go to ai_chatbot service**
2. **Click "Variables" tab**
3. **Add/Update the variables above**
4. **Save changes**
5. **Redeploy the service**

## **🔍 What This Does:**
- `${{MYSQLHOST}}` → Internal hostname for MySQL service
- `${{MYSQLPORT}}` → Internal port for MySQL service
- `${{MYSQLDATABASE}}` → Database name from MySQL service
- `${{MYSQLUSER}}` → Username from MySQL service
- `${{MYSQLPASSWORD}}` → Password from MySQL service

This should resolve the `ETIMEDOUT` issue by using Railway's internal network.
