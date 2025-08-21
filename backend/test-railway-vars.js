// Test Railway environment variables
console.log('🔍 Testing Railway Environment Variables...');
console.log('================================');

// Check all possible environment variables
const vars = [
  'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
  'MYSQLHOST', 'MYSQLPORT', 'MYSQLDATABASE', 'MYSQLUSER', 'MYSQLPASSWORD',
  'PORT', 'NODE_ENV', 'RAILWAY_ENVIRONMENT', 'RAILWAY_PROJECT_ID'
];

vars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value || 'NOT SET'}`);
});

console.log('================================');
console.log('All process.env keys:');
console.log(Object.keys(process.env).filter(key => 
  key.includes('DB_') || key.includes('MYSQL') || key.includes('RAILWAY')
));

console.log('================================');
