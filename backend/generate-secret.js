const crypto = require('crypto');

// Generate different types of secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const analyticsSecret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Generated Secrets:\n');
console.log('JWT_SECRET=' + jwtSecret);
console.log('ANALYTICS_SECRET=' + analyticsSecret);
console.log('\nCopy these to your .env file\n');