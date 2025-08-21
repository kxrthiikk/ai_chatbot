# 🌐 Static Ngrok Domain Setup

## ✅ Services Running

Your WhatsApp bot is now running with your static ngrok domain:

### **Services:**
- **Backend (Node.js):** Running on port 3000
- **Rasa (NLP):** Running on port 5005
- **Ngrok:** Using static domain `robust-emu-amused.ngrok-free.app`

### **Public URL:**
```
https://robust-emu-amused.ngrok-free.app
```

## 🔧 Meta Webhook Configuration

### **Webhook URL:**
```
https://robust-emu-amused.ngrok-free.app/api/whatsapp/webhook
```

### **Steps to Configure:**
1. Go to [Meta Developer Console](https://developers.facebook.com/)
2. Navigate to your WhatsApp Business app
3. Go to "Configuration" → "Webhooks"
4. Click "Configure"
5. Enter the following:
   - **Webhook URL:** `https://robust-emu-amused.ngrok-free.app/api/whatsapp/webhook`
   - **Verify Token:** (use the value from your `.env` file)
6. Select these fields:
   - ✅ `messages`
   - ✅ `message_deliveries`
   - ✅ `message_reads`
7. Click "Verify and Save"

## 🧪 Testing Your Webhook

### **Test Webhook Verification:**
```bash
curl "https://robust-emu-amused.ngrok-free.app/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
```

### **Test Message Processing:**
```bash
curl -X POST "https://robust-emu-amused.ngrok-free.app/api/whatsapp/webhook" \
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

### **Test with WhatsApp:**
1. Send a message to your WhatsApp Business number
2. Check your server logs for incoming messages
3. Verify responses are sent back

## 📋 Environment Variables

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

## 🔍 Monitoring

### **Check Service Status:**
```bash
# Check if services are running
netstat -an | findstr ":3000"
netstat -an | findstr ":5005"
netstat -an | findstr ":4040"
```

### **Ngrok Dashboard:**
- **URL:** http://localhost:4040
- **Status:** Shows tunnel status and traffic

## 🚀 Advantages of Static Domain

✅ **Consistent URL** - No need to update webhook when restarting
✅ **Professional** - Looks more professional than random URLs
✅ **Reliable** - Always accessible at the same address
✅ **Easy to remember** - Fixed domain name

## 🔒 Security Notes

- Your static domain is publicly accessible
- Ensure your webhook verification token is secure
- Monitor webhook traffic for suspicious activity
- Consider implementing rate limiting for production

## 📞 Support

If you encounter issues:
1. Check if all services are running
2. Verify your `.env` configuration
3. Test webhook endpoints with curl
4. Check Meta Developer Console settings
5. Monitor ngrok dashboard for errors

---

**Your WhatsApp bot is now live at:** `https://robust-emu-amused.ngrok-free.app`
