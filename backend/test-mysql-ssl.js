const mysql = require('mysql2/promise');

async function testMySQLWithSSL() {
  console.log('🔒 Testing MySQL Connection with SSL Options...');
  console.log('==============================================');
  
  // Different connection configurations to try
  const configs = [
    {
      name: 'Private URL with SSL Disabled',
      config: {
        uri: 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@mysql.railway.internal:3306/railway',
        ssl: false
      }
    },
    {
      name: 'Private URL with SSL Enabled (Reject Unauthorized)',
      config: {
        uri: 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@mysql.railway.internal:3306/railway',
        ssl: {
          rejectUnauthorized: true
        }
      }
    },
    {
      name: 'Private URL with SSL Enabled (Accept Self-Signed)',
      config: {
        uri: 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@mysql.railway.internal:3306/railway',
        ssl: {
          rejectUnauthorized: false
        }
      }
    },
    {
      name: 'Public URL with SSL Disabled',
      config: {
        uri: 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@metro.proxy.rlwy.net:41446/railway',
        ssl: false
      }
    },
    {
      name: 'Public URL with SSL Enabled (Accept Self-Signed)',
      config: {
        uri: 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@metro.proxy.rlwy.net:41446/railway',
        ssl: {
          rejectUnauthorized: false
        }
      }
    }
  ];

  for (const testConfig of configs) {
    console.log(`\n🧪 Testing: ${testConfig.name}`);
    console.log('--------------------------------');
    
    try {
      console.log('Connecting...');
      const connection = await mysql.createConnection(testConfig.config);
      console.log('✅ Connection successful!');
      
      // Test a simple query
      const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as db');
      console.log('✅ Query successful:', rows[0]);
      
      await connection.end();
      console.log('✅ Connection closed successfully');
      
      console.log('');
      console.log('🎉 SUCCESS! This configuration works!');
      console.log('====================================');
      console.log('Use this configuration in your ai_chatbot service:');
      console.log('');
      
      if (testConfig.config.uri.includes('mysql.railway.internal')) {
        console.log('MYSQL_URL=' + testConfig.config.uri);
        console.log('SSL_ENABLED=' + (testConfig.config.ssl ? 'true' : 'false'));
        if (testConfig.config.ssl && testConfig.config.ssl.rejectUnauthorized === false) {
          console.log('SSL_REJECT_UNAUTHORIZED=false');
        }
      } else {
        console.log('MYSQL_URL=' + testConfig.config.uri);
        console.log('SSL_ENABLED=' + (testConfig.config.ssl ? 'true' : 'false'));
        if (testConfig.config.ssl && testConfig.config.ssl.rejectUnauthorized === false) {
          console.log('SSL_REJECT_UNAUTHORIZED=false');
        }
      }
      
      return;
      
    } catch (error) {
      console.log('❌ Failed:', error.message);
      console.log('Error code:', error.code);
    }
  }
  
  console.log('\n❌ All SSL configurations failed!');
  console.log('\n💡 Next Steps:');
  console.log('1. Try restarting the MySQL service');
  console.log('2. Check if MySQL service supports SSL');
  console.log('3. Use a different database service');
}

// Run the test
testMySQLWithSSL().catch(console.error);
