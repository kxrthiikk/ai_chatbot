# 🚂 Railway Deployment Guide for WhatsApp Bot

## 🎯 What is Railway?
Railway is a cloud platform that makes it easy to deploy your applications with:
- ✅ **Free HTTPS** out of the box
- ✅ **Automatic deployments** from GitHub
- ✅ **No configuration** needed
- ✅ **Production-ready** infrastructure
- ✅ **Better than ngrok** for production use

## 📋 Prerequisites
1. **GitHub Account** - Your code must be on GitHub
2. **Railway Account** - Sign up at https://railway.app/
3. **Your WhatsApp Bot Code** - Ready to deploy

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Code
Your code is already ready! The following files are configured:
- ✅ `railway.json` - Railway configuration
- ✅ `Procfile` - Process definition
- ✅ `backend/package.json` - Dependencies
- ✅ `backend/index.js` - Main application

### Step 2: Push to GitHub
If your code isn't on GitHub yet:
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

### Step 3: Create Railway Account
1. Go to https://railway.app/
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Railway to access your GitHub

### Step 4: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository (`ai-bot` or your repo name)
4. Click "Deploy Now"

### Step 5: Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```env
# Database Configuration (Use Railway MySQL or your existing MySQL)
DB_HOST=your-mysql-host
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=dental_bot
DB_PORT=3306

# WhatsApp Configuration
WHATSAPP_VERIFY_TOKEN=dental_bot_verify_2024

# Server Configuration
PORT=3000
NODE_ENV=production
```

### Step 6: Get Your HTTPS URL
1. Go to your project's "Settings" tab
2. Copy the "Domain" URL (e.g., `https://your-app-name.railway.app`)
3. Your webhook URL will be: `https://your-app-name.railway.app/api/whatsapp/webhook`

### Step 7: Configure Meta Webhook
1. Go to Meta Developer Console
2. Navigate to your WhatsApp Business app
3. Go to "Configuration" → "Webhooks"
4. Click "Configure"
5. Enter:
   - **Webhook URL:** `https://your-app-name.railway.app/api/whatsapp/webhook`
   - **Verify Token:** `dental_bot_verify_2024`
6. Select these fields:
   - ✅ `messages`
   - ✅ `message_deliveries`
   - ✅ `message_reads`
7. Click "Verify and Save"

## 🗄️ Database Options

### Option A: Use Railway MySQL (Recommended)
1. In Railway dashboard, click "New"
2. Select "Database" → "MySQL"
3. Railway will automatically connect it to your app
4. Update environment variables with Railway's MySQL credentials

### Option B: Use Your Existing MySQL
Keep your current MySQL setup and just update the environment variables.

## 🔧 Troubleshooting

### Deployment Fails
- Check Railway logs in the dashboard
- Ensure all dependencies are in `backend/package.json`
- Verify `backend/index.js` exists and is correct

### Webhook Not Working
- Check if the app is running (green status in Railway)
- Verify environment variables are set correctly
- Test the webhook URL in browser: `https://your-app-name.railway.app/api/whatsapp/webhook`

### Database Connection Issues
- Verify database credentials in environment variables
- Check if database is accessible from Railway's servers
- Consider using Railway's MySQL for better connectivity

## 📊 Monitoring
- **Logs:** View real-time logs in Railway dashboard
- **Metrics:** Monitor CPU, memory, and network usage
- **Deployments:** Automatic deployments on every GitHub push

## 💰 Pricing
- **Free Tier:** $5 credit monthly (enough for small apps)
- **Paid Plans:** Start at $5/month for more resources

## 🎉 Benefits Over ngrok
- ✅ **Always Online** - No disconnections
- ✅ **Production Ready** - Real infrastructure
- ✅ **Automatic HTTPS** - No configuration needed
- ✅ **Better Performance** - Faster response times
- ✅ **Monitoring** - Built-in logs and metrics
- ✅ **Scalability** - Easy to scale up

## 🚀 Next Steps
1. Deploy to Railway
2. Configure Meta webhook
3. Test with real WhatsApp messages
4. Monitor logs and performance
5. Scale as needed

Your WhatsApp bot will be production-ready with Railway! 🎯
