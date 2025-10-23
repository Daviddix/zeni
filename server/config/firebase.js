const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');
const path = require('path');
require('dotenv').config(); 

const serviceAccount = require(path.join(__dirname, '../firebase-cred.json'));

// Initialize Firebase Admin SDK
initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
