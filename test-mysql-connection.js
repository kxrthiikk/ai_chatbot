const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('🔍 Testing MySQL Connection...');
  console.log('================================');
  
  // Test configurations
  const configs = [
    {
      name: 'MYSQL_URL (Internal)',
      config: {
        uri: process.env.MYSQL_URL
      }
    },
    {
      name: 'Individual Variables',
      config: {
        host: process.env.MYSQLHOST || 'mysql.railway.internal',
        port: process.env.MYSQLPORT || 3306,
        database: process.env.MYSQLDATABASE || 'railway',
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || 'SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf'
      }
    },
    {
      name: 'Public URL',
      config: {
        uri: 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@mysql-production-fb4ac.up.railway.app:3306/railway'
      }
    }
  ];

  for (const testConfig of configs) {
    console.log(`\n🧪 Testing: ${testConfig.name}`);
    console.log('--------------------------------');
    
    try {
      let connection;
      
      if (testConfig.config.uri) {
        console.log('Using URI connection...');
        connection = await mysql.createConnection(testConfig.config.uri);
      } else {
        console.log('Using individual config...');
        connection = await mysql.createConnection(testConfig.config);
      }
      
      console.log('✅ Connection successful!');
      
      // Test a simple query
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('✅ Query test successful:', rows[0]);
      
      await connection.end();
      console.log('✅ Connection closed successfully');
      
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('Error code:', error.code);
      console.log('Error number:', error.errno);
    }
  }
}

// Run the test
testMySQLConnection().catch(console.error);
