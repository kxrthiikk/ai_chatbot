console.log('🔍 Checking MySQL Service Configuration...');
console.log('==========================================');
console.log('');

// Show all environment variables related to MySQL
console.log('MySQL-related Environment Variables:');
console.log('====================================');
Object.keys(process.env).forEach(key => {
  if (key.includes('MYSQL') || key.includes('DATABASE')) {
    const value = process.env[key];
    if (key.includes('PASSWORD') || key.includes('URL')) {
      console.log(`${key}: ${value ? '***SET***' : 'NOT SET'}`);
    } else {
      console.log(`${key}: ${value || 'NOT SET'}`);
    }
  }
});

console.log('');
console.log('Railway Service Variables:');
console.log('==========================');
Object.keys(process.env).forEach(key => {
  if (key.includes('RAILWAY') && key.includes('MYSQL')) {
    const value = process.env[key];
    console.log(`${key}: ${value || 'NOT SET'}`);
  }
});

console.log('');
console.log('Current Service Information:');
console.log('============================');
console.log('Service Name:', process.env.RAILWAY_SERVICE_NAME);
console.log('Service ID:', process.env.RAILWAY_SERVICE_ID);
console.log('Environment:', process.env.RAILWAY_ENVIRONMENT);
console.log('Project ID:', process.env.RAILWAY_PROJECT_ID);

console.log('');
console.log('MySQL Service URL:', process.env.RAILWAY_SERVICE_MYSQL_URL);

console.log('');
console.log('💡 Recommendations:');
console.log('==================');
console.log('1. Go to your MySQL service in Railway dashboard');
console.log('2. Check if the service is running properly');
console.log('3. Look for any error messages or warnings');
console.log('4. Try restarting the MySQL service');
console.log('5. Check the MySQL service Variables tab for additional configuration');
console.log('');
console.log('If the MySQL service is not working, you might need to:');
console.log('- Delete and recreate the MySQL service');
console.log('- Use a different database service (like PlanetScale or Supabase)');
console.log('- Contact Railway support for MySQL issues');
