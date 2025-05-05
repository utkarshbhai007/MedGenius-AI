const crypto = require('crypto');
const key = crypto.randomBytes(64).toString('hex');
console.log('Your JWT Secret Key:');
console.log(key); 