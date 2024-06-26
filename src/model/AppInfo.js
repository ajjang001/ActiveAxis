import {app, db, storage, auth} from '../../.expo/api/firebase';
import {getDocs, collection} from 'firebase/firestore';


class AppInfo {

    constructor() {}

    async getFunctionsFeatures(){
      try{
        const querySnapshot = await getDocs(collection(db, "appinfo"));
        const features = querySnapshot.docs[0].data().features;
        return features;
      }catch(e){
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }
  
  }
  
  export default AppInfo;
  