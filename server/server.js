// server/server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import helmet from 'helmet';
import { readFile } from 'fs/promises';
import { onRequest } from 'firebase-functions/v2/https';

const serviceAccount = JSON.parse(
  await readFile(new URL('./api_key/serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.get('/test/data', async (req, res) => {
  const data = await new Promise(resolve => {
    setTimeout(() => resolve({ message: 'Hello from Node.js' }), 1000);
  });

  res.json(data);
});

app.post('/account/disable-account', async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.auth().updateUser(uid, {
      disabled: true
    });

    res.status(200).send({ message: `Successfully disabled user with UID: ${uid}` });
  } catch (error) {
    console.error('Error disabling user:', error);
    res.status(500).send({ error: 'Error disabling user', details: error });
  }
});

app.post('/account/enable-account', async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.auth().updateUser(uid, {
      disabled: false
    });

    res.status(200).send({ message: `Successfully enabled user with UID: ${uid}` });
  } catch (error) {
    console.error('Error enabling user:', error);
    res.status(500).send({ error: 'Error enabling user', details: error });
  }
});

app.post('/account/delete-account', async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.auth().deleteUser(uid);
    
    res.status(200).send({ message: `Successfully deleted user with UID: ${uid}` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'Error deleting user', details: error });
  }
});

app.post('/account/update-password', async (req, res) => {
  const { uid, newPassword } = req.body;

  try {
    await admin.auth().updateUser(uid, {
      password: newPassword
    });

    res.status(200).send({ message: `Successfully updated password for user with UID: ${uid}` });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send({ error: 'Error updating password', details: error });
  }
});


// Export the api function for Firebase Functions
export const myapi = onRequest(app);