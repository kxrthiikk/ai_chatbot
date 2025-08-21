# 🌐 WhatsApp Webhook Setup Guide

This guide will help you expose your local WhatsApp bot to Meta's webhooks using either ngrok (for development) or nginx (for production).

## 🚀 Quick Start (Development - ngrok)

### Step 1: Download ngrok
1. Go to https://ngrok.com/download
2. Download the Windows version
3. Extract `ngrok.exe` to your project directory

### Step 2: Start your services
```bash
# Run the deployment script
deploy-ngrok.bat

# Or manually start each service:

# Terminal 1: Start Rasa
cd rasa
py -3.10 -m rasa run --enable-api --cors "*" --port 5005

# Terminal 2: Start Backend
cd backend
npm start

# Terminal 3: Expose with ngrok
ngrok http 3000
```

### Step 3: Configure Meta Webhook
1. Go to Meta Developer Console
2. Navigate to your WhatsApp Business app
3. Go to "Configuration" → "Webhooks"
4. Click "Configure"
5. Enter the following:
   - **Webhook URL:** `https://your-ngrok-url.ngrok.io/api/whatsapp/webhook`
   - **Verify Token:** (use the value from your .env file)
6. Select the following fields:
   - ✅ `messages`
   - ✅ `message_deliveries`
   - ✅ `message_reads`
7. Click "Verify and Save"

## 🏭 Production Setup (nginx)

### Step 1: Install nginx
1. Download nginx from http://nginx.org/en/download.html
2. Extract to `C:\nginx`
3. Copy `nginx.conf` to `C:\nginx\conf\nginx.conf`
4. Update the `server_name` in nginx.conf with your domain

### Step 2: Configure SSL (Recommended)
```bash
# Install SSL certificate (Let's Encrypt or your provider)
# Update nginx.conf with SSL settings
```

### Step 3: Start services
```bash
# Run the deployment script
deploy-nginx.bat

# Or manually:
# 1. Start Rasa: py -3.10 -m rasa run --enable-api --cors "*" --port 5005
# 2. Start Backend: npm start
# 3. Start nginx: C:\nginx\nginx.exe
```

### Step 4: Configure Meta Webhook
- **Webhook URL:** `https://your-domain.com/api/whatsapp/webhook`
- **Verify Token:** (from your .env file)

## 🔧 Environment Configuration

Make sure your `.env` file in the backend directory contains:

```env
# WhatsApp Business API Configuration
WHATSAPP_TOKEN=your_whatsapp_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token_here

# Rasa Configuration
RASA_URL=http://localhost:5005
RASA_WEBHOOK_URL=http://localhost:5005/webhooks/rest/webhook

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📋 Webhook Endpoints

Your backend provides these webhook endpoints:

### GET `/api/whatsapp/webhook`
- **Purpose:** Webhook verification
- **Parameters:** 
  - `hub.mode`: "subscribe"
  - `hub.verify_token`: Your custom token
  - `hub.challenge`: Challenge string from Meta

### POST `/api/whatsapp/webhook`
- **Purpose:** Receive incoming messages
- **Headers:** Content-Type: application/json
- **Body:** WhatsApp Business API message format

## 🧪 Testing Your Webhook

### Test with curl:
```bash
# Test webhook verification
curl "https://your-domain.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"

# Test message processing (simulate WhatsApp message)
curl -X POST "https://your-domain.com/api/whatsapp/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "whatsapp_business_account",
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "1234567890",
            "text": {"body": "hello"},
            "type": "text"
          }]
        }
      }]
    }]
  }'
```

### Test with WhatsApp:
1. Send a message to your WhatsApp Business number
2. Check your server logs for incoming messages
3. Verify responses are sent back

## 🔍 Troubleshooting

### Common Issues:

1. **Webhook verification fails**
   - Check your `WHATSAPP_VERIFY_TOKEN` in .env
   - Ensure the token matches exactly

2. **Messages not received**
   - Verify webhook URL is accessible
   - Check server logs for errors
   - Ensure all required fields are selected in Meta console

3. **Responses not sent**
   - Check `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`
   - Verify your WhatsApp Business account is active
   - Check message template approval status

4. **ngrok URL changes**
   - ngrok URLs change on restart
   - Update webhook URL in Meta console when ngrok restarts

### Debug Commands:
```bash
# Check if services are running
netstat -an | findstr :3000
netstat -an | findstr :5005

# Check nginx status
C:\nginx\nginx.exe -t

# View nginx logs
tail -f C:\nginx\logs\error.log
```

## 📱 WhatsApp Business API Setup

### Prerequisites:
1. Meta Developer Account
2. WhatsApp Business App
3. Phone Number (verified)
4. Message Templates (approved)

### Required Permissions:
- `whatsapp_business_messaging`
- `whatsapp_business_management`

### Message Templates:
Create templates for:
- Welcome messages
- Appointment confirmations
- Reminders

## 🔒 Security Considerations

1. **Use HTTPS** in production
2. **Validate webhook signatures** (implement if needed)
3. **Rate limiting** for webhook endpoints
4. **Input validation** for all incoming data
5. **Secure environment variables**

## 📊 Monitoring

Monitor your webhook performance:
- Response times
- Error rates
- Message delivery status
- User engagement metrics

## 🆘 Support

If you encounter issues:
1. Check server logs
2. Verify Meta Developer Console settings
3. Test with curl commands
4. Check environment variables
5. Verify database connectivity

---

**Note:** For production use, consider using a proper domain with SSL certificates and implementing additional security measures.
