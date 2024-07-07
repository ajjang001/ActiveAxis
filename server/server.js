// server/server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccount from '../.expo/api/serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/api/data', async (req, res) => {
  const data = await new Promise(resolve => {
    setTimeout(() => resolve({ message: 'Hello from Node.js' }), 1000);
  });

  res.json(data);
});

app.post('/api/disable-account', async (req, res) => {
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

app.post('/api/enable-account', async (req, res) => {
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


app.post('/api/delete-account', async (req, res) => {
  const { uid } = req.body;

  try {
    await admin.auth().deleteUser(uid);
    
    res.status(200).send({ message: `Successfully deleted user with UID: ${uid}` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'Error deleting user', details: error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
