const mysql = require('mysql2/promise');

async function createMySQLUser() {
  console.log('🔧 Creating MySQL User for Application...');
  console.log('=========================================');
  
  // Try to connect using the public URL first (to create the user)
  const publicUrl = 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@metro.proxy.rlwy.net:41446/railway';
  
  console.log('🔗 Attempting to connect via public URL to create user...');
  
  try {
    const connection = await mysql.createConnection(publicUrl);
    console.log('✅ Connected successfully via public URL');
    
    // Create a new user for the application
    const appUser = 'app_user';
    const appPassword = 'AppPassword123!';
    const database = 'railway';
    
    console.log('👤 Creating application user...');
    
    // Create user with proper permissions
    await connection.execute(
      `CREATE USER IF NOT EXISTS '${appUser}'@'%' IDENTIFIED BY '${appPassword}'`
    );
    console.log('✅ User created successfully');
    
    // Grant all privileges on the database
    await connection.execute(
      `GRANT ALL PRIVILEGES ON ${database}.* TO '${appUser}'@'%'`
    );
    console.log('✅ Permissions granted successfully');
    
    // Grant additional privileges for database creation
    await connection.execute(
      `GRANT CREATE, DROP, ALTER ON *.* TO '${appUser}'@'%'`
    );
    console.log('✅ Additional permissions granted');
    
    // Flush privileges
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges flushed');
    
    await connection.end();
    
    console.log('');
    console.log('🎉 MySQL User Setup Completed!');
    console.log('==============================');
    console.log('Use these credentials in your ai_chatbot service:');
    console.log('');
    console.log('MYSQLHOST=mysql.railway.internal');
    console.log('MYSQLPORT=3306');
    console.log('MYSQLDATABASE=railway');
    console.log(`MYSQLUSER=${appUser}`);
    console.log(`MYSQLPASSWORD=${appPassword}`);
    console.log('');
    console.log('Or use this MYSQL_URL (private endpoint, no egress fees):');
    console.log(`MYSQL_URL=mysql://${appUser}:${appPassword}@mysql.railway.internal:3306/${database}`);
    
  } catch (error) {
    console.log('❌ Failed to create user:', error.message);
    console.log('Error code:', error.code);
    
    console.log('');
    console.log('💡 Alternative Solutions:');
    console.log('=======================');
    console.log('1. Try restarting the MySQL service first');
    console.log('2. Use a different database service (PlanetScale, Supabase)');
    console.log('3. Contact Railway support about MySQL permissions');
  }
}

// Run the setup
createMySQLUser().catch(console.error);
