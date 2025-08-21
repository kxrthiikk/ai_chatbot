# Railway Deployment Guide (Free HTTPS)

## Step 1: Create Railway Account
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create a new project

## Step 2: Connect Your Repository
1. Click "Deploy from GitHub repo"
2. Select your repository
3. Railway will automatically detect it's a Node.js project

## Step 3: Set Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=dental_bot
DB_PORT=3306
WHATSAPP_VERIFY_TOKEN=dental_bot_verify_2024
PORT=3000
```

## Step 4: Deploy
1. Railway will automatically deploy your app
2. You'll get a URL like: `https://your-app-name.railway.app`

## Step 5: Your HTTPS Webhook URL
```
https://your-app-name.railway.app/api/whatsapp/webhook
```

## Benefits:
- ✅ Free HTTPS
- ✅ Automatic deployments
- ✅ No configuration needed
- ✅ Works immediately
- ✅ Better than ngrok

## Alternative: Use Railway's MySQL
Railway also provides MySQL databases if you want to move your database there too.
