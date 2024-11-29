import express, { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';
import path from 'path';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve(__dirname, '/etc/secrets/poke-87981-firebase-adminsdk-evup9-9a8a45c644.json')
  ),
  databaseURL: 'https://poke-87981.firebaseio.com',
});

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const db = admin.firestore();
const collectionName = 'contacts';

// Seed contacts into Firestore
app.post('/seed-contacts', async (req: Request, res: Response) => {
  const contacts = [
    {
      name: 'Aminah Aliu',
      location: 'Princeton, NJ',
      lastContacted: '2024-07-01',
      photo: null,
      phone: '+1 234 567 8901',
      email: 'aminah0aliu@gmail.com',
      linkedin: 'https://www.linkedin.com/in/aminah-aliu/',
    },
    {
      name: 'Alexander Cholmsky',
      location: 'Waterloo, ON',
      lastContacted: '2024-06-15',
      photo: null,
      phone: '+1 987 654 3210',
      email: 'bob.brown@example.com',
      linkedin: 'https://linkedin.com/in/bobbrown',
    },
    {
      name: 'Jane Smith',
      location: 'Chicago, IL',
      lastContacted: '2024-08-10',
      photo: null,
      phone: '+1 555 123 4567',
      email: 'jane_smith@example.com',
      linkedin: 'https://linkedin.com/in/janesmith',
    },
  ];

  try {
    for (const contact of contacts) {
      await db.collection(collectionName).add(contact);
    }
    console.log("Seeded successfully")
    res.status(200).send('Sample contacts seeded successfully!');
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send('Error seeding contacts: ' + error.message);
    } else {
      res.status(500).send('Error seeding contacts');
    }
  }
});

// Add a new contact
app.post('/contacts', async (req: Request, res: Response): Promise<void> => {
  try {
    const newContact = req.body;

    if (!newContact.name || !newContact.company || !newContact.lastContacted) {
      res.status(400).send('Missing required fields: name, company, or lastContacted');
      return;
    }

    const addedContact = await db.collection(collectionName).add(newContact);
    const addedContactData = await addedContact.get();

    res.status(201).json({ id: addedContact.id, ...addedContactData.data() });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send('Error adding contact: ' + error.message);
    } else {
      res.status(500).send('Error adding contact');
    }
  }
});

// Get all contacts
app.get('/contacts', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) {
      res.status(404).send('No contacts found');
      return;
    }
    const contacts: any[] = [];
    snapshot.forEach((doc) => {
      contacts.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(contacts);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send('Error getting contacts: ' + error.message);
    } else {
      res.status(500).send('Error getting contacts');
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
