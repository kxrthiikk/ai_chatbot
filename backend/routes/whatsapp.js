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

// Status endpoint to check bot health
router.get('/status', async (req, res) => {
  try {
    const { pool, isPostgreSQL } = require('../db');
    
    // Test database connection
    if (isPostgreSQL) {
      const client = await pool.connect();
      await client.query('SELECT 1 as test');
      client.release();
    } else {
      const connection = await pool.getConnection();
      await connection.execute('SELECT 1 as test');
      connection.release();
    }
    
    res.json({
      status: 'OK',
      message: 'WhatsApp Bot is running and database is connected',
      timestamp: new Date().toISOString(),
      features: {
        webhook: '✅ Active',
        database: '✅ Connected',
        whatsapp: process.env.WHATSAPP_TOKEN ? '✅ Configured' : '❌ Missing Token'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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
    console.log(`👤 User:`, user);
    
    // Get current conversation state
    const state = await getConversationState(user.id);
    console.log(`💬 State:`, state);
    
    // Process message based on current state
    const response = await processUserMessage(user, messageText, state);
    console.log(`🤖 Response:`, response);
    
    // Send response back to WhatsApp
    if (response) {
      await sendWhatsAppMessage(phoneNumber, response);
    }
    
  } catch (error) {
    console.error('❌ Error handling incoming message:', error);
    console.error('❌ Error stack:', error.stack);
  }
}

// Create or get user from database
async function createOrGetUser(phoneNumber) {
  const { pool, isPostgreSQL } = require('../db');
  
  try {
    console.log(`🔍 Creating/getting user for phone: ${phoneNumber}`);
    
    // Check if user exists
    let existingUsers;
    if (isPostgreSQL) {
      const result = await pool.query(
        'SELECT * FROM users WHERE phone_number = $1',
        [phoneNumber]
      );
      existingUsers = result.rows;
      console.log(`🔍 PostgreSQL query result:`, result.rows);
    } else {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE phone_number = ?',
        [phoneNumber]
      );
      existingUsers = rows;
      console.log(`🔍 MySQL query result:`, rows);
    }
    
    if (existingUsers.length > 0) {
      console.log(`✅ Found existing user:`, existingUsers[0]);
      return existingUsers[0];
    }
    
    console.log(`🆕 Creating new user for phone: ${phoneNumber}`);
    
    // Create new user
    let result;
    if (isPostgreSQL) {
      result = await pool.query(
        'INSERT INTO users (phone_number, name, created_by, updated_by) VALUES ($1, $2, 1, 1) RETURNING id',
        [phoneNumber, `User_${phoneNumber.slice(-4)}`]
      );
      const newUser = { id: result.rows[0].id, phone_number: phoneNumber };
      console.log(`✅ Created new PostgreSQL user:`, newUser);
      return newUser;
    } else {
      const [rows] = await pool.execute(
        'INSERT INTO users (phone_number, name, created_by, updated_by) VALUES (?, ?, 1, 1)',
        [phoneNumber, `User_${phoneNumber.slice(-4)}`]
      );
      const newUser = { id: rows.insertId, phone_number: phoneNumber };
      console.log(`✅ Created new MySQL user:`, newUser);
      return newUser;
    }
  } catch (error) {
    console.error('❌ Error creating/getting user:', error);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
}

// Get conversation state for user
async function getConversationState(userId) {
  const { pool, isPostgreSQL } = require('../db');
  
  try {
    console.log(`🔍 Getting conversation state for user: ${userId}`);
    
    let states;
    if (isPostgreSQL) {
      const result = await pool.query(
        'SELECT * FROM conversation_states WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [userId]
      );
      states = result.rows;
      console.log(`🔍 PostgreSQL conversation states:`, result.rows);
    } else {
      const [rows] = await pool.execute(
        'SELECT * FROM conversation_states WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
        [userId]
      );
      states = rows;
      console.log(`🔍 MySQL conversation states:`, rows);
    }
    
    if (states.length > 0) {
      console.log(`✅ Found existing conversation state:`, states[0]);
      return states[0];
    }
    
    console.log(`🆕 Creating new conversation state for user: ${userId}`);
    
    // Create initial state
    let result;
    if (isPostgreSQL) {
      result = await pool.query(
        'INSERT INTO conversation_states (user_id, current_state, context, created_by, updated_by) VALUES ($1, $2, $3, 1, 1) RETURNING id',
        [userId, 'welcome', JSON.stringify({})]
      );
      const newState = { id: result.rows[0].id, user_id: userId, current_state: 'welcome', context: '{}' };
      console.log(`✅ Created new PostgreSQL conversation state:`, newState);
      return newState;
    } else {
      const [rows] = await pool.execute(
        'INSERT INTO conversation_states (user_id, current_state, context, created_by, updated_by) VALUES (?, ?, ?, 1, 1)',
        [userId, 'welcome', JSON.stringify({})]
      );
      const newState = { id: rows.insertId, user_id: userId, current_state: 'welcome', context: '{}' };
      console.log(`✅ Created new MySQL conversation state:`, newState);
      return newState;
    }
  } catch (error) {
    console.error('❌ Error getting conversation state:', error);
    console.error('❌ Error stack:', error.stack);
    throw error;
  }
}

// Enhanced message processing with better NLP
async function processUserMessage(user, messageText, state) {
  const { pool, isPostgreSQL } = require('../db');
  
  try {
    console.log(`🔍 Processing message: "${messageText}" for user ${user.id} in state "${state.current_state}"`);
    
    const currentState = state.current_state;
    let response = '';
    let newState = currentState;
    let context = JSON.parse(state.context || '{}');
    
    console.log(`📝 Current context:`, context);
    
    // Enhanced message understanding
    const messageLower = messageText.toLowerCase();
    const words = messageLower.split(' ');
    
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
        // Enhanced intent recognition
        if (messageLower.includes('1') || 
            messageLower.includes('book') || 
            messageLower.includes('appointment') ||
            messageLower.includes('schedule') ||
            messageLower.includes('make appointment')) {
          response = `📅 Great! Let's book your appointment.

What date would you like to book? (e.g., "tomorrow", "next Monday", or "2024-01-15")`;
          newState = 'booking_date';
        } else if (messageLower.includes('2') || 
                   messageLower.includes('check') || 
                   messageLower.includes('available') ||
                   messageLower.includes('slots') ||
                   messageLower.includes('time') ||
                   messageLower.includes('hours')) {
          response = `📋 Available time slots:

Monday - Friday: 9:00 AM - 6:00 PM
Saturday: 9:00 AM - 2:00 PM
Sunday: Closed

Would you like to book an appointment? (yes/no)`;
          newState = 'check_slots';
        } else if (messageLower.includes('3') || 
                   messageLower.includes('cancel') ||
                   messageLower.includes('reschedule')) {
          response = `❌ To cancel an appointment, please provide your appointment ID or phone number.`;
          newState = 'cancel_appointment';
        } else if (messageLower.includes('4') || 
                   messageLower.includes('info') ||
                   messageLower.includes('information') ||
                   messageLower.includes('help') ||
                   messageLower.includes('about')) {
          response = `ℹ️ Dental Care Information:

📍 Location: 123 Dental Street, City
📞 Phone: +1-234-567-8900
🕒 Hours: Mon-Fri 9AM-6PM, Sat 9AM-2PM
💳 We accept all major insurance plans

Need anything else?`;
          newState = 'main_menu';
        } else if (messageLower.includes('hello') || 
                   messageLower.includes('hi') ||
                   messageLower.includes('hey')) {
          response = `Hello! How can I help you today?

1️⃣ Book appointment
2️⃣ Check slots
3️⃣ Cancel appointment
4️⃣ Get information`;
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
        // Enhanced date processing
        let appointmentDate = messageText;
        
        // Simple date parsing
        if (messageLower.includes('tomorrow')) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          appointmentDate = tomorrow.toISOString().split('T')[0];
        } else if (messageLower.includes('next week')) {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          appointmentDate = nextWeek.toISOString().split('T')[0];
        } else if (messageLower.includes('monday')) {
          // Find next Monday
          const today = new Date();
          const daysUntilMonday = (8 - today.getDay()) % 7;
          const nextMonday = new Date(today);
          nextMonday.setDate(today.getDate() + daysUntilMonday);
          appointmentDate = nextMonday.toISOString().split('T')[0];
        }
        
        response = `📅 You selected: ${appointmentDate}

What time would you prefer?
- Morning (9:00 AM - 12:00 PM)
- Afternoon (12:00 PM - 3:00 PM)
- Evening (3:00 PM - 6:00 PM)

Please choose your preferred time.`;
        context.bookingDate = appointmentDate;
        newState = 'booking_time';
        break;
        
      case 'booking_time':
        // Enhanced time processing
        let appointmentTime = messageText;
        
        if (messageLower.includes('morning') || messageLower.includes('9') || messageLower.includes('10') || messageLower.includes('11')) {
          appointmentTime = 'Morning (9:00 AM - 12:00 PM)';
        } else if (messageLower.includes('afternoon') || messageLower.includes('12') || messageLower.includes('1') || messageLower.includes('2')) {
          appointmentTime = 'Afternoon (12:00 PM - 3:00 PM)';
        } else if (messageLower.includes('evening') || messageLower.includes('3') || messageLower.includes('4') || messageLower.includes('5') || messageLower.includes('6')) {
          appointmentTime = 'Evening (3:00 PM - 6:00 PM)';
        }
        
        response = `⏰ You selected: ${appointmentTime}

What type of service do you need?
1️⃣ General Checkup
2️⃣ Cleaning
3️⃣ Filling
4️⃣ Root Canal
5️⃣ Other

Please choose a service (1-5).`;
        context.bookingTime = appointmentTime;
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
    console.log(`💾 Updating state from "${currentState}" to "${newState}"`);
    try {
      if (isPostgreSQL) {
        await pool.query(
          'UPDATE conversation_states SET current_state = $1, context = $2, updated_at = NOW(), updated_by = 1 WHERE id = $3',
          [newState, JSON.stringify(context), state.id]
        );
        console.log(`✅ PostgreSQL state updated successfully`);
      } else {
        await pool.execute(
          'UPDATE conversation_states SET current_state = ?, context = ?, updated_at = NOW(), updated_by = 1 WHERE id = ?',
          [newState, JSON.stringify(context), state.id]
        );
        console.log(`✅ MySQL state updated successfully`);
      }
    } catch (dbError) {
      console.error('❌ Database update error:', dbError);
      console.error('❌ Database update error stack:', dbError.stack);
      throw dbError;
    }
    
    console.log(`✅ Message processed successfully. Response: "${response}"`);
    return response;
  } catch (error) {
    console.error('❌ Error processing user message:', error);
    console.error('❌ Error stack:', error.stack);
    return 'Sorry, something went wrong. Please try again.';
  }
}

// Save appointment to database
async function saveAppointment(userId, context) {
  const { pool, isPostgreSQL } = require('../db');
  
  try {
    // Convert date string to proper format (you can enhance this)
    const appointmentDate = new Date().toISOString().split('T')[0]; // Simple fallback
    
    if (isPostgreSQL) {
      await pool.query(
        'INSERT INTO appointments (user_id, appointment_date, appointment_time, service_type, status, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, 1, 1)',
        [userId, appointmentDate, context.bookingTime, context.bookingService, 'pending']
      );
    } else {
      await pool.execute(
        'INSERT INTO appointments (user_id, appointment_date, appointment_time, service_type, status, created_by, updated_by) VALUES (?, ?, ?, ?, ?, 1, 1)',
        [userId, appointmentDate, context.bookingTime, context.bookingService, 'pending']
      );
    }
    
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
