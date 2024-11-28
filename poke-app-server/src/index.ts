import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert('secrets/poke-87981-firebase-adminsdk-evup9-9a8a45c644.json'),
  databaseURL: 'https://poke-87981.firebaseio.com', // Ensure the URL is correct
});

const db = admin.firestore();
const collectionName = 'contacts';

async function seedContacts() {
  const contacts: Array<{
    name: string;
    location: string;
    lastContacted: string;
    photo: string | null;
    phone: string;
    email: string;
    linkedin: string;
  }> = [
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

  for (const contact of contacts) {
    await db.collection(collectionName).add(contact);
  }
  console.log('Sample contacts seeded successfully!');
}

async function getDocument(documentId: string): Promise<void> {
  try {
    const docRef = db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();
    if (doc.exists) {
      console.log('Document data:', doc.data());
    } else {
      console.log('No document found for ID:', documentId);
    }
  } catch (error) {
    console.error('Error getting document:', error);
  }
}

// Get all documents
async function getAllDocuments() {
  try {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) {
      console.log('No documents found!');
      return;
    }
    snapshot.forEach((doc) => {
      console.log('Document ID:', doc.id);
      console.log('Document data:', doc.data());
    });
  } catch (error) {
    console.error('Error getting documents:', error);
  }
}

// Query by field (e.g., by location)
async function queryByField() {
  try {
    const snapshot = await db.collection(collectionName).where('location', '==', 'New York, NY').get();
    if (snapshot.empty) {
      console.log('No matching documents!');
      return;
    }
    snapshot.forEach((doc) => {
      console.log('Document ID:', doc.id);
      console.log('Document data:', doc.data());
    });
  } catch (error) {
    console.error('Error querying documents:', error);
  }
}

// Run the functions
(async () => {
  await seedContacts();
  await getAllDocuments();
  await queryByField();
})();
