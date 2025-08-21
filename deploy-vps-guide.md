# VPS Deployment Guide with HTTPS

## Option A: DigitalOcean Droplet

### Step 1: Create a Droplet
1. Go to DigitalOcean
2. Create a new droplet (Ubuntu 22.04)
3. Choose your plan ($5-10/month)

### Step 2: Connect to Server
```bash
ssh root@your-server-ip
```

### Step 3: Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Nginx
apt install nginx -y

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y
```

### Step 4: Deploy Your Bot
```bash
# Clone your code
git clone your-repository
cd your-bot-directory

# Install dependencies
npm install

# Create .env file
nano .env
# Add your environment variables

# Install PM2
npm install -g pm2

# Start the bot
pm2 start index.js --name "whatsapp-bot"
pm2 startup
pm2 save
```

### Step 5: Configure Nginx
```bash
# Create Nginx config
nano /etc/nginx/sites-available/whatsapp-bot

# Add the configuration from nginx-https.conf
# Update the domain name

# Enable the site
ln -s /etc/nginx/sites-available/whatsapp-bot /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 6: Get SSL Certificate
```bash
# Get SSL certificate
certbot --nginx -d your-domain.com

# Auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Option B: Railway/Render/Heroku

These platforms provide HTTPS out of the box:

### Railway:
1. Connect your GitHub repo
2. Set environment variables
3. Deploy automatically

### Render:
1. Create a new Web Service
2. Connect your repo
3. Set build command: `npm install`
4. Set start command: `npm start`

## Your HTTPS Webhook URL:
```
https://your-domain.com/api/whatsapp/webhook
```
