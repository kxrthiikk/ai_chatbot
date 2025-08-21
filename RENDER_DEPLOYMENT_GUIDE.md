# Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)

## Step 1: Connect to GitHub
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `kxrthiikk/ai_chatbot`

## Step 2: Configure the Service

### Basic Settings:
- **Name:** `ai-chatbot`
- **Environment:** `Node`
- **Region:** Choose closest to you
- **Branch:** `main`

### Build & Deploy Settings:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

## Step 3: Environment Variables

Add these environment variables in Render dashboard:

### Database Configuration:
```
DB_HOST=your_database_host
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

### WhatsApp Configuration:
```
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=my_verify_token_123
```

### Other Settings:
```
NODE_ENV=production
PORT=3000
```

## Step 4: Database Options

### Option A: Use External Database
- Use your existing MySQL database
- Set the connection details in environment variables

### Option B: Use Render PostgreSQL (Recommended)
1. Create a new PostgreSQL service in Render
2. Use the provided connection string
3. Update your database configuration

## Step 5: Deploy
1. Click "Create Web Service"
2. Wait for the build to complete
3. Your app will be available at: `https://your-app-name.onrender.com`

## Step 6: Configure WhatsApp Webhook
1. Go to Meta Developer Console
2. Set webhook URL: `https://your-app-name.onrender.com/api/whatsapp/webhook`
3. Set verify token: `my_verify_token_123`
4. Click "Verify and Save"

## Troubleshooting

### Build Fails:
- Check that all dependencies are in `backend/package.json`
- Ensure Node.js version is compatible (18+)

### Database Connection Fails:
- Verify environment variables are set correctly
- Check database is accessible from Render's servers
- Consider using Render's PostgreSQL service

### Webhook Verification Fails:
- Check the verify token matches exactly
- Ensure the webhook URL is accessible
- Check server logs for errors

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` or `your-db-host.com` |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Database name | `dental_bot` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `your_password` |
| `WHATSAPP_TOKEN` | Meta WhatsApp token | `EAA...` |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID | `123456789` |
| `WHATSAPP_VERIFY_TOKEN` | Webhook verify token | `my_verify_token_123` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
