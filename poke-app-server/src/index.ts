import express, { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import cors from 'cors';
import path from 'path';


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve(__dirname, '../secrets/poke-87981-firebase-adminsdk-evup9-9a8a45c644.json')
  ),
  databaseURL: 'https://poke-87981.firebaseio.com',
});

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const db = admin.firestore();
const collectionName = 'contacts';

// Extend Request type to include `user` field
interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
  };
}

// Middleware to authenticate users
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1]; // Extract Bearer token

    if (!token) {
      res.status(401).send({ error: "Unauthorized: Missing token" });
      return; // Terminate the request
    }

    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach user information (uid) to the request
    req.user = { uid: decodedToken.uid };

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(401).send({ error: "Unauthorized: Invalid token" });
  }
};

// Seed contacts into Firestore
app.post('/seed-contacts', authenticate, async (req: Request, res: Response) => {
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
    const userId = (req as any).user.uid;
    for (const contact of contacts) {
      // await db.collection(collectionName).add(contact);
      await db.collection("users").doc(userId).collection(collectionName).add(contact)
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
app.post('/contacts', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.uid;

    const newContact = req.body;
    
    if (!newContact.name || !newContact.company || !newContact.lastContacted) {
      res.status(400).send('Missing required fields: name, company, or lastContacted');
      return;
    }
    const userContactsRef = db.collection("users").doc(userId).collection(collectionName);

    // Add the new contact to the subcollection
    const addedContact = await userContactsRef.add(newContact);

    // Get the added contact data to include in the response
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

// store a batch of contacts (more efficient)
app.post('/contacts/batch', authenticate, async (req: Request, res: Response): Promise<void> =>  {
  try {
    const { contacts } = req.body;
    console.log("Received batch contacts:", contacts);

    if (!contacts || !Array.isArray(contacts)) {
      res.status(400).send('Invalid request: contacts must be an array');
      return;
    }

    const userId = (req as any).user.uid;
    const userContactsRef = db.collection("users").doc(userId).collection(collectionName);

    const batch = db.batch(); // Firestore batch operation
    const addedContacts: any[] = [];

    contacts.forEach((contact) => {
      if (!contact.name || !contact.company || !contact.lastContacted) {
        throw new Error(`Invalid contact data: ${JSON.stringify(contact)}`);
      }
      const contactRef = userContactsRef.doc();
      batch.set(contactRef, contact);
      addedContacts.push({ id: contactRef.id, ...contact }); // Include IDs in the response
    });

    await batch.commit();
    res.status(201).json(addedContacts);
  } catch (error) {
    console.error("Error processing batch:", error);
    if (error instanceof Error) {
      res.status(500).send('Error adding contact: ' + error.message);
    } else {
      res.status(500).send('Error adding contact');
    }
  }
});

app.put('/contacts/:contactId', authenticate, async (req: Request, res: Response): Promise<void> =>  {
  try {
    // Extract userId from the authenticated user
    const userId = (req as any).user.uid;

    // Extract contactId from the request parameters
    const { contactId } = req.params;

    // Ensure the request body contains the updated contact fields
    const updatedContact = req.body;
    if (!updatedContact || Object.keys(updatedContact).length === 0) {
      res.status(400).send("No contact data provided.");
      return
    }

    // Reference to the specific contact document in Firestore
    const contactRef = db
      .collection("users")
      .doc(userId)
      .collection(collectionName)
      .doc(contactId);

    // Check if the contact exists
    const contactSnapshot = await contactRef.get();
    if (!contactSnapshot.exists) {
      res.status(404).send("Contact not found.");
      return
    }

    // Update the contact with the new data
    await contactRef.update(updatedContact);

    // Send a success response
    res.status(200).send({ message: "Contact updated successfully." });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).send("Error updating contact.");
  }
});

// Get all contacts
app.get('/contacts', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const userContactsRef = db.collection("users").doc(userId).collection(collectionName);
  
    const snapshot = await userContactsRef.orderBy("lastContacted", "asc").limit(20).get();
    if (snapshot.empty) {
      res.status(200).json([]); // Return an empty array instead of 404
      return;
    }
    const contacts: any[] = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the Firestore document ID
      ...doc.data(), // Include the rest of the document data
    }));
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);

    // Return an appropriate error message
    if (error instanceof Error) {
      res.status(500).json({ error: 'Error fetching contacts: ' + error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while fetching contacts' });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
