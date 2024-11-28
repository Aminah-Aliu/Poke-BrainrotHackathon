import express from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';

admin.initializeApp({
  credential: admin.credential.cert('secrets/poke-87981-firebase-adminsdk-evup9-9a8a45c644.json'),
  databaseURL: 'https://poke-87981.firebaseio.com', // Ensure the URL is correct
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = admin.firestore();
const collectionName = 'contacts';

// Seed contacts into Firestore
app.post('/seed-contacts', async (req, res) => {
  const contacts = [
    {
      name: 'Aminah Aliu',
      location: 'Princeton, NJ',
      lastContacted: '2024-07-01',
      photo: "aminah_profile.png",
      phone: '+1 234 567 8901',
      email: 'aminah0aliu@gmail.com',
      linkedin: 'https://www.linkedin.com/in/aminah-aliu/',
    },
    {
      name: 'Alexander Cholmsky',
      location: 'Waterloo, ON',
      lastContacted: '2024-06-15',
      photo: "Alex_Headshot_2024.png",
      phone: '+1 987 654 3210',
      email: 'bob.brown@example.com',
      linkedin: 'https://linkedin.com/in/bobbrown',
    },
    {
      name: 'Jane Smith',
      location: 'Chicago, IL',
      lastContacted: '2024-08-10',
      photo: "default_headshot.jpeg",
      phone: '+1 555 123 4567',
      email: 'jane_smith@example.com',
      linkedin: 'https://linkedin.com/in/janesmith',
    },
  ];

  try {
    for (const contact of contacts) {
      await db.collection(collectionName).add(contact);
    }
    res.status(200).send('Sample contacts seeded successfully!');
  } catch (error) {
    res.status(500).send('Error seeding contacts: ' + error.message);
  }
});

// Get all contacts
app.get('/contacts', async (req, res) => {
  try {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) {
      res.status(404).send('No contacts found');
      return;
    }
    const contacts = [];
    snapshot.forEach(doc => {
      contacts.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).send('Error getting contacts: ' + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
