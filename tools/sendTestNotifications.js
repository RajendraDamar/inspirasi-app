/**
 * Simple test sender using Firebase Admin SDK to send FCM messages.
 * Usage:
 *   node tools/sendTestNotifications.js --token <FCM_TOKEN> --priority high --alertType wind-alert
 */
const admin = require('firebase-admin');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');

const serviceAccountPath = argv['serviceAccount'] || process.env.FIREBASE_ADMIN_SDK_JSON;
if (!serviceAccountPath) {
  console.error('Provide a service account JSON via --serviceAccount or FIREBASE_ADMIN_SDK_JSON');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const token = argv['token'];
if (!token) {
  console.error('Provide --token <FCM token>');
  process.exit(1);
}

const priority = argv['priority'] || 'normal';
const alertType = argv['alertType'] || 'general';

async function send() {
  const sendTimestamp = Date.now();
  const message = {
    token,
    android: {
      priority: priority === 'high' ? 'high' : 'normal',
    },
    apns: {
      headers: {
        'apns-priority': priority === 'high' ? '10' : '5',
      },
    },
    data: {
      sendTimestamp: String(sendTimestamp),
      alertType,
    },
    notification: {
      title: `Test ${alertType}`,
      body: `Priority: ${priority} sent at ${new Date(sendTimestamp).toISOString()}`,
    },
  };

  try {
    const res = await admin.messaging().send(message);
    console.log('Sent message:', res);
  } catch (e) {
    console.error('Failed to send message', e);
    process.exit(2);
  }
}

send();
