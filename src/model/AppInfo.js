import {app, db, storage, auth} from '../../.expo/api/firebase';
import {getDocs, collection, doc, updateDoc} from 'firebase/firestore';
import { getDownloadURL, ref } from "firebase/storage";

class AppInfo {

    constructor() {}

    async getAboutActiveAxis(){
      try{
        const querySnapshot = await getDocs(collection(db, "appinfo"));
        const about = querySnapshot.docs[0].data().about;
        return about;
      }catch(e){
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }

    async getLogoURL() {
      try {
        const logoRef = ref(storage, 'assets/actaxislogo.png');
        const logoURL = await getDownloadURL(logoRef);
        return logoURL;
      } catch (e) {
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }

    async getFunctionsFeatures(){
      try{
        const querySnapshot = await getDocs(collection(db, "appinfo"));
        const features = querySnapshot.docs[0].data().features;
        return features;
      }catch(e){
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }
    
    async updateAboutActiveAxis(about){
      try {
        const querySnapshot = await getDocs(collection(db, "appinfo"));
        const docId = querySnapshot.docs[0].id; // Assuming there's only one document
        const docRef = doc(db, "appinfo", docId);
        await updateDoc(docRef, { about });
      } catch (e) {
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }

    async updateFunctionsFeatures(newFeatures){
      try {
        const querySnapshot = await getDocs(collection(db, "appinfo"));
        const docId = querySnapshot.docs[0].id; // Assuming there's only one document
        const docRef = doc(db, "appinfo", docId);
        await updateDoc(docRef, { features: newFeatures });
      } catch (e) {
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }
  }
  
  export default AppInfo;