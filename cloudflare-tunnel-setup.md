# Cloudflare Tunnel Setup Guide

## Step 1: Install Cloudflare Tunnel

### Windows (using winget):
```bash
winget install Cloudflare.CloudflareTunnel
```

### Or download from:
https://github.com/cloudflare/cloudflared/releases

## Step 2: Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will open a browser window to authenticate with your Cloudflare account.

## Step 3: Create a Tunnel

```bash
cloudflared tunnel create whatsapp-bot
```

This will create a tunnel and give you a tunnel ID.

## Step 4: Configure the Tunnel

Create a config file: `~/.cloudflared/config.yml`

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: ~/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: your-domain.com
    service: http://localhost:3000
  - service: http_status:404
```

## Step 5: Start the Tunnel

```bash
cloudflared tunnel run whatsapp-bot
```

## Step 6: Your HTTPS URL

Your webhook URL will be:
```
https://your-domain.com/api/whatsapp/webhook
```

## Benefits:
- ✅ Free HTTPS
- ✅ Custom domain support
- ✅ No port forwarding needed
- ✅ Automatic SSL certificates
- ✅ Better performance than ngrok
