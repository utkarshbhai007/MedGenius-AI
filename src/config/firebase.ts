// Mock firebase exports
// This file only exists to prevent import errors in code that depends on Firebase
// The actual authentication is handled by the backend

console.log('Using mock Firebase configuration');

// Create mock objects to prevent errors
const auth = {};
const db = {};
const googleProvider = {};

export { auth, db, googleProvider }; 