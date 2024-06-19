import firebaseConfig from '../../.expo/api/firebase'
import { initializeApp, getApp } from 'firebase/app';
import 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';

let app;
try {
  app = getApp();
} catch (error) {
  app = initializeApp(firebaseConfig);
}

class Model {
  constructor() {
    this.db = getFirestore(app);
  }

  async getData(collectionName) {
    const snapshot = await getDocs(collection(this.db, collectionName));
    return snapshot.docs.map(doc => ({_id: doc.id, ...doc.data()}) );
  }

  async addData(collection, data) {
    await setDoc(doc(this.db, collection, data.id), data);
  }
}

export default Model;