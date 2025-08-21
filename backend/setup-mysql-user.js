const mysql = require('mysql2/promise');

async function setupMySQLUser() {
  console.log('🔧 Setting up MySQL user for application...');
  console.log('==========================================');
  
  // First, try to connect as root using the public URL (if available)
  let rootConnection;
  
  try {
    console.log('🔍 Attempting to connect as root...');
    
    // Try different connection methods for root
    const rootConfigs = [
      {
        name: 'MYSQL_URL from environment',
        config: process.env.MYSQL_URL
      },
      {
        name: 'Public URL',
        config: 'mysql://root:SZ1JMOFAGpQNJCaFVpSWGXIvveDyeZtf@mysql-production-fb4ac.up.railway.app:3306/railway'
      }
    ];
    
    for (const config of rootConfigs) {
      try {
        console.log(`Trying ${config.name}...`);
        rootConnection = await mysql.createConnection(config.config);
        console.log('✅ Root connection successful!');
        break;
      } catch (error) {
        console.log(`❌ ${config.name} failed:`, error.message);
      }
    }
    
    if (!rootConnection) {
      console.log('❌ Could not establish root connection');
      console.log('This might be a Railway MySQL permission issue');
      console.log('Let\'s try a different approach...');
      return;
    }
    
    // Create a new user for the application
    console.log('\n👤 Creating application user...');
    
    const appUser = 'app_user';
    const appPassword = 'AppPassword123!';
    const appDatabase = 'railway';
    
    try {
      // Create user
      await rootConnection.execute(
        `CREATE USER IF NOT EXISTS '${appUser}'@'%' IDENTIFIED BY '${appPassword}'`
      );
      console.log('✅ User created successfully');
      
      // Grant permissions
      await rootConnection.execute(
        `GRANT ALL PRIVILEGES ON ${appDatabase}.* TO '${appUser}'@'%'`
      );
      console.log('✅ Permissions granted successfully');
      
      // Flush privileges
      await rootConnection.execute('FLUSH PRIVILEGES');
      console.log('✅ Privileges flushed');
      
      console.log('\n🎉 MySQL user setup completed!');
      console.log('================================');
      console.log('Use these credentials in your ai_chatbot service:');
      console.log('');
      console.log('MYSQLHOST=mysql.railway.internal');
      console.log('MYSQLPORT=3306');
      console.log('MYSQLDATABASE=railway');
      console.log(`MYSQLUSER=${appUser}`);
      console.log(`MYSQLPASSWORD=${appPassword}`);
      console.log('');
      console.log('Or use this MYSQL_URL:');
      console.log(`MYSQL_URL=mysql://${appUser}:${appPassword}@mysql.railway.internal:3306/${appDatabase}`);
      
    } catch (error) {
      console.log('❌ Error creating user:', error.message);
      console.log('This might be a permission issue with Railway MySQL');
    }
    
    await rootConnection.end();
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('\n💡 Alternative solution:');
    console.log('Since we cannot create a new user, let\'s try using the existing Railway MySQL setup');
    console.log('Go to your MySQL service in Railway and check if there are any other users available');
  }
}

// Run the setup
setupMySQLUser().catch(console.error);
