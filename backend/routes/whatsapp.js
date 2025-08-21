const express = require('express');
const router = express.Router();
const axios = require('axios');

// Set verify_token
const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

// Debug endpoint to check environment variables
router.get('/debug', (req, res) => {
  res.json({
    verifyToken: verifyToken,
    hasToken: !!verifyToken,
    envVars: {
      WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN ? 'SET' : 'NOT SET',
      WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN ? 'SET' : 'NOT SET',
      WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT
    },
    timestamp: new Date().toISOString()
  });
});

// Route for GET requests (webhook verification)
router.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  // Debug logging
  console.log('🔍 Webhook verification request:');
  console.log('Mode:', mode);
  console.log('Token:', token);
  console.log('Expected:', verifyToken);
  console.log('Challenge:', challenge);

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.log('❌ WEBHOOK VERIFICATION FAILED');
    console.log('Mode:', mode);
    console.log('Token:', token);
    console.log('Expected:', verifyToken);
    res.status(403).end();
  }
});

// Route for POST requests (message handling)
router.post('/webhook', async (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\n📱 Webhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  
  try {
    // Process the incoming message
    await processMessage(req.body);
    res.status(200).end();
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).end();
  }
});

// Process incoming messages
async function processMessage(body) {
  try {
    const { object, entry } = body;
    
    if (object === 'whatsapp_business_account') {
      for (const entryItem of entry) {
        const { changes } = entryItem;
        
        for (const change of changes) {
          if (change.field === 'messages') {
            const { value } = change;
            
            if (value && value.messages && value.messages.length > 0) {
              const message = value.messages[0];
              await handleIncomingMessage(message, value);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error in processMessage:', error);
  }
}

// Handle individual incoming message
async function handleIncomingMessage(message, value) {
  try {
    const { from, text, timestamp } = message;
    const phoneNumber = from;
    const messageText = text ? text.body : '';
    
    console.log(`📨 Message from ${phoneNumber}: ${messageText}`);
    
    // Create or get user
    const user = await createOrGetUser(phoneNumber);
    
    // Get current conversation state
    const state = await getConversationState(user.id);
    
    // Process message based on current state
    const response = await processUserMessage(user, messageText, state);
    
    // Send response back to WhatsApp
    if (response) {
      await sendWhatsAppMessage(phoneNumber, response);
    }
    
  } catch (error) {
    console.error('❌ Error handling incoming message:', error);
  }
}

// Create or get user from database
async function createOrGetUser(phoneNumber) {
  const { pool } = require('../db');
  
  try {
    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE phone_number = ?',
      [phoneNumber]
    );
    
    if (existingUsers.length > 0) {
      return existingUsers[0];
    }
    
    // Create new user
    const [result] = await pool.execute(
      'INSERT INTO users (phone_number, name, created_by, updated_by) VALUES (?, ?, 1, 1)',
      [phoneNumber, `User_${phoneNumber.slice(-4)}`]
    );
    
    return { id: result.insertId, phone_number: phoneNumber };
  } catch (error) {
    console.error('❌ Error creating/getting user:', error);
    throw error;
  }
}

// Get conversation state for user
async function getConversationState(userId) {
  const { pool } = require('../db');
  
  try {
    const [states] = await pool.execute(
      'SELECT * FROM conversation_states WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
      [userId]
    );
    
    if (states.length > 0) {
      return states[0];
    }
    
    // Create initial state
    const [result] = await pool.execute(
      'INSERT INTO conversation_states (user_id, current_state, context, created_by, updated_by) VALUES (?, ?, ?, 1, 1)',
      [userId, 'welcome', JSON.stringify({})]
    );
    
    return { id: result.insertId, user_id: userId, current_state: 'welcome', context: '{}' };
  } catch (error) {
    console.error('❌ Error getting conversation state:', error);
    throw error;
  }
}

// Process user message based on current state
async function processUserMessage(user, messageText, state) {
  const { pool } = require('../db');
  
  try {
    const currentState = state.current_state;
    let response = '';
    let newState = currentState;
    let context = JSON.parse(state.context || '{}');
    
    switch (currentState) {
      case 'welcome':
        response = `👋 Welcome to Dental Care Bot! 

I can help you with:
1️⃣ Book an appointment
2️⃣ Check available slots
3️⃣ Cancel appointment
4️⃣ Get information

Please choose an option (1-4) or type your message.`;
        newState = 'main_menu';
        break;
        
      case 'main_menu':
        if (messageText.includes('1') || messageText.toLowerCase().includes('book') || messageText.toLowerCase().includes('appointment')) {
          response = `📅 Great! Let's book your appointment.

What date would you like to book? (e.g., "tomorrow", "next Monday", or "2024-01-15")`;
          newState = 'booking_date';
        } else if (messageText.includes('2') || messageText.toLowerCase().includes('check') || messageText.toLowerCase().includes('available')) {
          response = `📋 Available time slots:

Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 9:00 AM - 2:00 PM
Sunday: Closed

Would you like to book an appointment? (yes/no)`;
          newState = 'check_slots';
        } else if (messageText.includes('3') || messageText.toLowerCase().includes('cancel')) {
          response = `❌ To cancel an appointment, please provide your appointment ID or phone number.`;
          newState = 'cancel_appointment';
        } else if (messageText.includes('4') || messageText.toLowerCase().includes('info')) {
          response = `ℹ️ Dental Care Information:

📍 Location: 123 Dental Street, City
📞 Phone: +1-234-567-8900
🕒 Hours: Mon-Fri 9AM-6PM, Sat 9AM-2PM
💳 We accept all major insurance plans

Need anything else?`;
          newState = 'main_menu';
        } else {
          response = `I didn't understand that. Please choose:
1️⃣ Book appointment
2️⃣ Check slots
3️⃣ Cancel appointment
4️⃣ Get information`;
          newState = 'main_menu';
        }
        break;
        
      case 'booking_date':
        // Simple date processing (you can enhance this)
        response = `📅 You selected: ${messageText}

What time would you prefer?
- Morning (9:00 AM - 12:00 PM)
- Afternoon (12:00 PM - 3:00 PM)
- Evening (3:00 PM - 6:00 PM)

Please choose your preferred time.`;
        context.bookingDate = messageText;
        newState = 'booking_time';
        break;
        
      case 'booking_time':
        response = `⏰ You selected: ${messageText}

What type of service do you need?
1️⃣ General Checkup
2️⃣ Cleaning
3️⃣ Filling
4️⃣ Root Canal
5️⃣ Other

Please choose a service (1-5).`;
        context.bookingTime = messageText;
        newState = 'booking_service';
        break;
        
      case 'booking_service':
        const services = {
          '1': 'General Checkup',
          '2': 'Cleaning',
          '3': 'Filling',
          '4': 'Root Canal',
          '5': 'Other'
        };
        
        const service = services[messageText] || 'Other';
        context.bookingService = service;
        
        response = `✅ Perfect! Here's your appointment summary:

📅 Date: ${context.bookingDate}
⏰ Time: ${context.bookingTime}
🦷 Service: ${service}

To confirm, please reply with "CONFIRM" or "CANCEL" to modify.`;
        newState = 'booking_confirmation';
        break;
        
      case 'booking_confirmation':
        if (messageText.toLowerCase().includes('confirm')) {
          // Save appointment to database
          await saveAppointment(user.id, context);
          
          response = `🎉 Appointment confirmed!

📅 Date: ${context.bookingDate}
⏰ Time: ${context.bookingTime}
🦷 Service: ${context.bookingService}

You'll receive a reminder 24 hours before your appointment. Thank you!`;
          newState = 'main_menu';
          context = {};
        } else if (messageText.toLowerCase().includes('cancel')) {
          response = `❌ Appointment cancelled. 

Would you like to book a different appointment? (yes/no)`;
          newState = 'main_menu';
          context = {};
        } else {
          response = `Please reply with "CONFIRM" to book or "CANCEL" to modify.`;
          newState = 'booking_confirmation';
        }
        break;
        
      default:
        response = `I'm not sure what you mean. Let me help you:

1️⃣ Book appointment
2️⃣ Check slots
3️⃣ Cancel appointment
4️⃣ Get information`;
        newState = 'main_menu';
    }
    
    // Update conversation state
    await pool.execute(
      'UPDATE conversation_states SET current_state = ?, context = ?, updated_at = NOW(), updated_by = 1 WHERE id = ?',
      [newState, JSON.stringify(context), state.id]
    );
    
    return response;
  } catch (error) {
    console.error('❌ Error processing user message:', error);
    return 'Sorry, something went wrong. Please try again.';
  }
}

// Save appointment to database
async function saveAppointment(userId, context) {
  const { pool } = require('../db');
  
  try {
    // Convert date string to proper format (you can enhance this)
    const appointmentDate = new Date().toISOString().split('T')[0]; // Simple fallback
    
    await pool.execute(
      'INSERT INTO appointments (user_id, appointment_date, appointment_time, service_type, status, created_by, updated_by) VALUES (?, ?, ?, ?, ?, 1, 1)',
      [userId, appointmentDate, context.bookingTime, context.bookingService, 'pending']
    );
    
    console.log(`✅ Appointment saved for user ${userId}`);
  } catch (error) {
    console.error('❌ Error saving appointment:', error);
    throw error;
  }
}

// Send message to WhatsApp
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!token || !phoneNumberId) {
      console.error('❌ Missing WhatsApp credentials');
      return;
    }
    
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Message sent to ${phoneNumber}:`, response.data);
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
  }
}

module.exports = router;
