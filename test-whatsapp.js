// Test script to simulate WhatsApp messages
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test messages to simulate WhatsApp conversation
const testMessages = [
  {
    from: '+1234567890',
    text: 'Hello',
    expectedState: 'greeting'
  },
  {
    from: '+1234567890',
    text: 'John Doe',
    expectedState: 'collecting_name'
  },
  {
    from: '+1234567890',
    text: 'Regular Checkup',
    expectedState: 'collecting_service'
  },
  {
    from: '+1234567890',
    text: '25/12/2024',
    expectedState: 'collecting_date'
  },
  {
    from: '+1234567890',
    text: '1',
    expectedState: 'collecting_time'
  }
];

async function testWhatsAppBot() {
  console.log('🧪 Testing WhatsApp Bot...\n');

  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`📱 Test ${i + 1}: "${message.text}"`);
    
    try {
      // Simulate WhatsApp webhook payload
      const webhookPayload = {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            value: {
              messages: [{
                from: message.from,
                text: { body: message.text },
                type: 'text'
              }]
            }
          }]
        }]
      };

      const response = await axios.post(`${BASE_URL}/whatsapp/webhook`, webhookPayload);
      console.log(`✅ Response: ${response.status}`);
      
      // Wait a bit between messages
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('---');
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('🔍 Testing API Endpoints...\n');
  
  const endpoints = [
    '/health',
    '/stats',
    '/appointments',
    '/users',
    '/time-slots'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      console.log(`✅ ${endpoint}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.response?.status || error.message}`);
    }
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting WhatsApp Bot Tests\n');
  
  await testAPIEndpoints();
  console.log('\n');
  await testWhatsAppBot();
  
  console.log('\n✅ Tests completed!');
}

runTests().catch(console.error);
