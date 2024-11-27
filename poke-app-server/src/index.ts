import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert('../secrets/poke-87981-firebase-adminsdk-evup9-9a8a45c644.json'),
  databaseURL: 'https://poke-87981.firebaseio.com', // Ensure the URL is correct
});

const db = admin.firestore();
const collectionName = 'users';

// Seed users into Firestore
async function seedUsers() {
  const users: Array<{ name: string; age: number }> = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 40 },
  ];
  

  for (const user of users) {
    await db.collection('users').add(user);
  }
  console.log('Sample data seeded successfully!');
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
    const snapshot = await db.collection('users').get();
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

// Query by field
async function queryByField() {
  try {
    const snapshot = await db.collection('users').where('age', '>=', 18).get();
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
  await seedUsers();
  await getAllDocuments();
  await queryByField();
})();
