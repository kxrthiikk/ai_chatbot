const mysql = require('mysql2/promise');

async function testPublicMySQL() {
  console.log('🔍 Testing MySQL Public URL Connection...');
  console.log('=========================================');
  
  // The public URL from your MySQL service
  const publicUrl = 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@metro.proxy.rlwy.net:41446/railway';
  
  console.log('Testing Public URL:', publicUrl.replace(/:[^:@]*@/, ':****@'));
  console.log('');
  
  try {
    console.log('🔗 Attempting connection...');
    const connection = await mysql.createConnection(publicUrl);
    console.log('✅ Connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as db');
    console.log('✅ Query successful:', rows[0]);
    
    await connection.end();
    console.log('✅ Connection closed successfully');
    
    console.log('');
    console.log('🎉 SUCCESS! Public URL works!');
    console.log('=============================');
    console.log('Use this MYSQL_URL in your ai_chatbot service:');
    console.log('MYSQL_URL=' + publicUrl);
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('Error code:', error.code);
    console.log('Error number:', error.errno);
    
    console.log('');
    console.log('💡 The public URL might not be accessible from Railway');
    console.log('Let\'s try restarting the MySQL service first');
  }
}

// Run the test
testPublicMySQL().catch(console.error);
