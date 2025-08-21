// Railway Environment Variables Helper
// This script helps you set the correct environment variables in Railway

console.log('🔧 Railway Environment Variables Helper');
console.log('=====================================');
console.log('');

// Check if we're in Railway environment
if (process.env.RAILWAY_ENVIRONMENT) {
  console.log('✅ Running in Railway environment');
  console.log(`Environment: ${process.env.RAILWAY_ENVIRONMENT}`);
  console.log(`Project ID: ${process.env.RAILWAY_PROJECT_ID}`);
  console.log(`Service: ${process.env.RAILWAY_SERVICE_NAME}`);
  console.log('');
  
  // Check for MySQL service variables
  const mysqlVars = {
    MYSQLHOST: process.env.MYSQLHOST,
    MYSQLPORT: process.env.MYSQLPORT,
    MYSQLDATABASE: process.env.MYSQLDATABASE,
    MYSQLUSER: process.env.MYSQLUSER,
    MYSQLPASSWORD: process.env.MYSQLPASSWORD
  };
  
  console.log('🔍 MySQL Service Variables:');
  Object.entries(mysqlVars).forEach(([key, value]) => {
    console.log(`${key}: ${value || 'NOT SET'}`);
  });
  
  console.log('');
  console.log('📋 Recommended Environment Variables for your ai_chatbot service:');
  console.log('=====================================');
  
  if (mysqlVars.MYSQLHOST) {
    console.log('✅ MySQL service detected! Use these variables:');
    console.log('');
    console.log('DB_HOST=' + mysqlVars.MYSQLHOST);
    console.log('DB_PORT=' + (mysqlVars.MYSQLPORT || '3306'));
    console.log('DB_NAME=' + (mysqlVars.MYSQLDATABASE || 'railway'));
    console.log('DB_USER=' + (mysqlVars.MYSQLUSER || 'root'));
    console.log('DB_PASSWORD=' + (mysqlVars.MYSQLPASSWORD || ''));
    console.log('');
    console.log('PORT=3000');
    console.log('NODE_ENV=production');
    console.log('');
    console.log('WHATSAPP_TOKEN=your_whatsapp_token_here');
    console.log('WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here');
  } else {
    console.log('❌ MySQL service variables not found!');
    console.log('');
    console.log('You need to:');
    console.log('1. Add a MySQL database to your Railway project');
    console.log('2. Make sure it\'s in the same project as your ai_chatbot service');
    console.log('3. Railway will automatically provide MYSQL* variables');
  }
  
} else {
  console.log('❌ Not running in Railway environment');
  console.log('This script should be run in Railway to detect available variables');
}

console.log('');
console.log('=====================================');
