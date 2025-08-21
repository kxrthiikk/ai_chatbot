const mysql = require('mysql2/promise');

async function testMySQLConnection() {
  console.log('🔍 Testing MySQL Connection...');
  console.log('================================');
  
  // Show all environment variables
  console.log('Environment Variables:');
  console.log('MYSQL_URL:', process.env.MYSQL_URL ? 'SET' : 'NOT SET');
  console.log('MYSQLHOST:', process.env.MYSQLHOST || 'NOT SET');
  console.log('MYSQLPORT:', process.env.MYSQLPORT || 'NOT SET');
  console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE || 'NOT SET');
  console.log('MYSQLUSER:', process.env.MYSQLUSER || 'NOT SET');
  console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? 'SET' : 'NOT SET');
  console.log('');
  
  // Test configurations
  const configs = [
    {
      name: 'MYSQL_URL (Current)',
      config: {
        uri: process.env.MYSQL_URL
      }
    },
    {
      name: 'Individual Variables',
      config: {
        host: process.env.MYSQLHOST || 'mysql.railway.internal',
        port: parseInt(process.env.MYSQLPORT) || 3306,
        database: process.env.MYSQLDATABASE || 'railway',
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || 'SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf'
      }
    },
    {
      name: 'Hardcoded Internal',
      config: {
        host: 'mysql.railway.internal',
        port: 3306,
        database: 'railway',
        user: 'root',
        password: 'SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf'
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
        console.log('URI:', testConfig.config.uri.replace(/:[^:@]*@/, ':****@')); // Hide password
        connection = await mysql.createConnection(testConfig.config.uri);
      } else {
        console.log('Using individual config...');
        console.log('Host:', testConfig.config.host);
        console.log('Port:', testConfig.config.port);
        console.log('Database:', testConfig.config.database);
        console.log('User:', testConfig.config.user);
        connection = await mysql.createConnection(testConfig.config);
      }
      
      console.log('✅ Connection successful!');
      
      // Test a simple query
      const [rows] = await connection.execute('SELECT 1 as test');
      console.log('✅ Query test successful:', rows[0]);
      
      // Test database name
      const [dbRows] = await connection.execute('SELECT DATABASE() as current_db');
      console.log('✅ Current database:', dbRows[0].current_db);
      
      await connection.end();
      console.log('✅ Connection closed successfully');
      
      // If we get here, the connection worked!
      console.log('🎉 SUCCESS! This configuration works!');
      return;
      
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('Error code:', error.code);
      console.log('Error number:', error.errno);
      console.log('SQL State:', error.sqlState);
    }
  }
  
  console.log('\n❌ All connection attempts failed!');
}

// Run the test
testMySQLConnection().catch(console.error);
