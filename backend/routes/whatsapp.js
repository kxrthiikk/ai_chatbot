const express = require('express');
const axios = require('axios');
const { pool } = require('../db');
const moment = require('moment');

const router = express.Router();

// WhatsApp webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('✅ WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// WhatsApp webhook for receiving messages
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry.length > 0) {
        const entry = body.entry[0];
        
        if (entry.changes && entry.changes.length > 0) {
          const change = entry.changes[0];
          
          if (change.value && change.value.messages && change.value.messages.length > 0) {
            const message = change.value.messages[0];
            await processMessage(message);
          }
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Process incoming WhatsApp message
async function processMessage(message) {
  try {
    const phoneNumber = message.from;
    const messageText = message.text?.body || '';
    const messageType = message.type;

    console.log(`📱 Received message from ${phoneNumber}: ${messageText}`);

    // Get or create user
    const user = await getOrCreateUser(phoneNumber);

    // Get conversation state
    const conversationState = await getConversationState(phoneNumber);

    // Process message based on current state
    let response = await processMessageByState(messageText, conversationState, user);

    // Send response back to WhatsApp
    await sendWhatsAppMessage(phoneNumber, response);

  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
}

// Get or create user
async function getOrCreateUser(phoneNumber) {
  try {
    const connection = await pool.getConnection();
    
    // Check if user exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE phone_number = ?',
      [phoneNumber]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return existingUsers[0];
    }

    // Create new user
    const [result] = await connection.execute(
      'INSERT INTO users (phone_number, created_by, updated_by) VALUES (?, 1, 1)',
      [phoneNumber]
    );

    connection.release();
    
    return {
      id: result.insertId,
      phone_number: phoneNumber
    };
  } catch (error) {
    console.error('❌ Error getting/creating user:', error);
    throw error;
  }
}

// Get conversation state
async function getConversationState(phoneNumber) {
  try {
    const connection = await pool.getConnection();
    
    const [states] = await connection.execute(
      'SELECT * FROM conversation_states WHERE phone_number = ?',
      [phoneNumber]
    );

    connection.release();

    if (states.length > 0) {
      return {
        current_state: states[0].current_state,
        context_data: JSON.parse(states[0].context_data || '{}')
      };
    }

    return {
      current_state: 'greeting',
      context_data: {}
    };
  } catch (error) {
    console.error('❌ Error getting conversation state:', error);
    return {
      current_state: 'greeting',
      context_data: {}
    };
  }
}

// Update conversation state
async function updateConversationState(phoneNumber, state, contextData = {}) {
  try {
    const connection = await pool.getConnection();
    
    await connection.execute(
      `INSERT INTO conversation_states (phone_number, current_state, context_data, created_by, updated_by) 
       VALUES (?, ?, ?, 1, 1) 
       ON DUPLICATE KEY UPDATE 
       current_state = VALUES(current_state), 
       context_data = VALUES(context_data),
       updated_at = CURRENT_TIMESTAMP,
       updated_by = 1`,
      [phoneNumber, state, JSON.stringify(contextData)]
    );

    connection.release();
  } catch (error) {
    console.error('❌ Error updating conversation state:', error);
  }
}

// Process message based on current state
async function processMessageByState(messageText, conversationState, user) {
  const currentState = conversationState.current_state;
  const contextData = conversationState.context_data;

  switch (currentState) {
    case 'greeting':
      return await handleGreeting(messageText, user);

    case 'collecting_name':
      return await handleNameCollection(messageText, user);

    case 'collecting_service':
      return await handleServiceSelection(messageText, user);

    case 'collecting_date':
      return await handleDateSelection(messageText, user);

    case 'collecting_time':
      return await handleTimeSelection(messageText, user);

    case 'confirming_booking':
      return await handleBookingConfirmation(messageText, user, contextData);

    default:
      return await handleGreeting(messageText, user);
  }
}

// Handle greeting
async function handleGreeting(messageText, user) {
  const response = `👋 Welcome to Dental Care Bot! 

I can help you book a dental appointment. 

Please tell me your name:`;
  
  await updateConversationState(user.phone_number, 'collecting_name');
  return response;
}

// Handle name collection
async function handleNameCollection(messageText, user) {
  // Update user name
  const connection = await pool.getConnection();
  await connection.execute(
    'UPDATE users SET name = ?, updated_by = 1 WHERE id = ?',
    [messageText, user.id]
  );
  connection.release();

  const response = `Nice to meet you, ${messageText}! 

What type of dental service do you need?
1. Regular Checkup
2. Cleaning
3. Filling
4. Root Canal
5. Extraction
6. Other

Please reply with the number or service name:`;
  
  await updateConversationState(user.phone_number, 'collecting_service');
  return response;
}

// Handle service selection
async function handleServiceSelection(messageText, user) {
  const services = {
    '1': 'Regular Checkup',
    '2': 'Cleaning',
    '3': 'Filling',
    '4': 'Root Canal',
    '5': 'Extraction',
    '6': 'Other'
  };

  const selectedService = services[messageText] || messageText;
  
  const response = `Great! You've selected: ${selectedService}

When would you like to book your appointment?
Please enter the date (DD/MM/YYYY format):`;
  
  await updateConversationState(user.phone_number, 'collecting_date', { service: selectedService });
  return response;
}

// Handle date selection
async function handleDateSelection(messageText, user) {
  const date = moment(messageText, 'DD/MM/YYYY');
  
  if (!date.isValid()) {
    return `Please enter a valid date in DD/MM/YYYY format (e.g., 25/12/2024):`;
  }

  const today = moment();
  if (date.isBefore(today, 'day')) {
    return `Please select a future date. Today is ${today.format('DD/MM/YYYY')}. Enter a valid date:`;
  }

  const response = `Perfect! Date: ${date.format('DD/MM/YYYY')}

Available time slots:
1. 09:00 AM - 10:00 AM
2. 10:00 AM - 11:00 AM
3. 11:00 AM - 12:00 PM
4. 02:00 PM - 03:00 PM
5. 03:00 PM - 04:00 PM
6. 04:00 PM - 05:00 PM

Please select a time slot (1-6):`;
  
  await updateConversationState(user.phone_number, 'collecting_time', { 
    service: user.context_data?.service,
    date: date.format('YYYY-MM-DD')
  });
  return response;
}

// Handle time selection
async function handleTimeSelection(messageText, user) {
  const timeSlots = {
    '1': '09:00-10:00',
    '2': '10:00-11:00',
    '3': '11:00-12:00',
    '4': '14:00-15:00',
    '5': '15:00-16:00',
    '6': '16:00-17:00'
  };

  const selectedTime = timeSlots[messageText];
  if (!selectedTime) {
    return `Please select a valid time slot (1-6):`;
  }

  const contextData = user.context_data || {};
  const response = `📅 Appointment Summary:

Service: ${contextData.service}
Date: ${moment(contextData.date).format('DD/MM/YYYY')}
Time: ${selectedTime}

Please confirm your booking by typing "YES" or "CONFIRM":`;
  
  await updateConversationState(user.phone_number, 'confirming_booking', {
    service: contextData.service,
    date: contextData.date,
    time: selectedTime
  });
  return response;
}

// Handle booking confirmation
async function handleBookingConfirmation(messageText, user) {
  const confirmKeywords = ['yes', 'confirm', 'ok', 'sure'];
  const isConfirmed = confirmKeywords.some(keyword => 
    messageText.toLowerCase().includes(keyword)
  );

  if (isConfirmed) {
    // Create appointment
    const contextData = user.context_data || {};
    const connection = await pool.getConnection();
    
    const [startTime, endTime] = contextData.time.split('-');
    
    await connection.execute(
      `INSERT INTO appointments (user_id, appointment_date, start_time, end_time, service_type, status, created_by, updated_by) 
       VALUES (?, ?, ?, ?, ?, 'pending', 1, 1)`,
      [user.id, contextData.date, startTime, endTime, contextData.service]
    );
    
    connection.release();

    const response = `✅ Appointment confirmed!

📅 Your appointment details:
Service: ${contextData.service}
Date: ${moment(contextData.date).format('DD/MM/YYYY')}
Time: ${contextData.time}

We'll send you a reminder 24 hours before your appointment.

Thank you for choosing our dental services! 🦷

To book another appointment, just send "hello" or "book appointment".`;
    
    await updateConversationState(user.phone_number, 'greeting');
    return response;
  } else {
    return `❌ Appointment cancelled.

To book a new appointment, send "hello" or "book appointment".`;
  }
}

// Send WhatsApp message
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Message sent successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = router;
