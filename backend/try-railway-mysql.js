const mysql = require('mysql2/promise');

async function tryRailwayMySQL() {
  console.log('🔍 Trying Railway MySQL Connection Methods...');
  console.log('============================================');
  
  // Show all Railway-related environment variables
  console.log('Railway Environment Variables:');
  Object.keys(process.env).forEach(key => {
    if (key.includes('MYSQL') || key.includes('RAILWAY')) {
      const value = process.env[key];
      if (key.includes('PASSWORD')) {
        console.log(`${key}: ${value ? '***SET***' : 'NOT SET'}`);
      } else {
        console.log(`${key}: ${value || 'NOT SET'}`);
      }
    }
  });
  console.log('');
  
  // Try different connection methods
  const connectionAttempts = [
    {
      name: 'MYSQL_URL (Current)',
      config: process.env.MYSQL_URL
    },
    {
      name: 'MYSQL_PUBLIC_URL',
      config: process.env.MYSQL_PUBLIC_URL
    },
    {
      name: 'Railway Service Discovery',
      config: `mysql://root:${process.env.MYSQL_ROOT_PASSWORD}@${process.env.RAILWAY_SERVICE_MYSQL_URL}:3306/${process.env.MYSQL_DATABASE || 'railway'}`
    },
    {
      name: 'Hardcoded Public URL',
      config: 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@mysql-production-fb4ac.up.railway.app:3306/railway'
    }
  ];
  
  for (const attempt of connectionAttempts) {
    if (!attempt.config) {
      console.log(`⏭️  Skipping ${attempt.name} - not available`);
      continue;
    }
    
    console.log(`\n🧪 Trying: ${attempt.name}`);
    console.log('--------------------------------');
    
    try {
      console.log('Connecting...');
      const connection = await mysql.createConnection(attempt.config);
      console.log('✅ Connection successful!');
      
      // Test query
      const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as db');
      console.log('✅ Query successful:', rows[0]);
      
      await connection.end();
      console.log('🎉 SUCCESS! This method works!');
      
      // Show the working configuration
      console.log('\n📋 Working Configuration:');
      console.log('========================');
      if (attempt.name === 'MYSQL_URL (Current)') {
        console.log('Keep your current MYSQL_URL variable');
      } else if (attempt.name === 'MYSQL_PUBLIC_URL') {
        console.log('Use MYSQL_URL=' + attempt.config);
      } else {
        console.log('Use MYSQL_URL=' + attempt.config);
      }
      
      return;
      
    } catch (error) {
      console.log('❌ Failed:', error.message);
      console.log('Error code:', error.code);
    }
  }
  
  console.log('\n❌ All connection attempts failed!');
  console.log('\n💡 Next Steps:');
  console.log('1. Check if your MySQL service is properly configured');
  console.log('2. Try restarting the MySQL service');
  console.log('3. Contact Railway support if the issue persists');
}

// Run the test
tryRailwayMySQL().catch(console.error);
