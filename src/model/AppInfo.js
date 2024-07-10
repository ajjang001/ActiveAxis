import {app, db, storage, auth} from '../../.expo/api/firebase';
import {getDocs, collection} from 'firebase/firestore';
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

    async getAppFeedbackCount(){
       try{
        const querySnapshot = await getDocs(collection(db, "appfeedback"));
        const feedbackCount = querySnapshot.size;
        return feedbackCount;
       }catch(e){
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
       }
    }
  
  }
  
  export default AppInfo;