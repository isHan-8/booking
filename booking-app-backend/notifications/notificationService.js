const admin = require('firebase-admin');
var serviceAccount = require("../authentication-app-18dbd-firebase-adminsdk-re2wq-b5d104f8fe.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://authentication-app-18dbd-default-rtdb.firebaseio.com"
  });

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  const sendNotification = async (token, title, body) => {
    const message = {
      notification: {
        title,
        body
      },
      token
    };
  
    try {
      const response = await admin.messaging().send(message);
      console.log('Notification sent:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  
  module.exports = { sendNotification };