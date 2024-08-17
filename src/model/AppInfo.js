
import { db, storage } from '../firebase/firebaseConfig';
import {getDoc, getDocs, collection, doc, updateDoc, query} from 'firebase/firestore';
import { getDownloadURL, ref } from "firebase/storage";

class AppInfo {

    constructor() {}

    async getAboutActiveAxis(){
      try{
        // Get the about Active Axis
        const querySnapshot = await getDocs(collection(db, "appinfo"));
        const about = querySnapshot.docs[0].data().about;
        return about;
      }catch(e){
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }

    async getLogoURL() {
      try {
        // Get the logo URL
        const logoRef = ref(storage, 'assets/actaxislogo.png');
        const logoURL = await getDownloadURL(logoRef);
        return logoURL;
      } catch (e) {
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }

    async getFunctionsFeatures(){
      try{
        // Get the features
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

    async getAvgRatings(){
      try{
        const querySnapshot = await getDocs(collection(db, "appfeedback"));
        let totalRatings = 0;

        querySnapshot.forEach((doc) => {
          totalRatings += doc.data().rating; 
        });
        return totalRatings/querySnapshot.size;
      } catch(e){
        throw new Error("Error occured: " + e.message + "\nPlease try again or contact customer support"); 
      }
    }
    
  
    async updateAboutActiveAxis(about){
      try {
        // Update the about Active Axis
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
        // Update the features
        const querySnapshot = await getDocs(collection(db, "appinfo"));
        const docId = querySnapshot.docs[0].id; // Assuming there's only one document
        const docRef = doc(db, "appinfo", docId);
        await updateDoc(docRef, { features: newFeatures });
      } catch (e) {
        throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support");
      }
    }

    async getStats(){
      try{
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
  
        const docRef = doc(db, "appinfo", "F82QLdLK8zJhc1oT90qq");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const querySnapshot = await getDocs(collection(db, "user"));
          let dateArray = docSnap.data().days;

          let userCountArray = docSnap.data().userCount;

          const [day, month] = dateArray[dateArray.length - 1].split('/').map(Number);

          // Get the current year 
          const currentYear = new Date().getFullYear(); 
          // Create a new Date object 
          const date = new Date(currentYear, month - 1, day);

          if(currentDate.valueOf() === date.valueOf()){
            userCountArray[userCountArray.length - 1] = querySnapshot.size; 
            
            await updateDoc(docRef, { userCount: userCountArray});
          } else { 
            //remove the first element from both arrays
            dateArray.shift();
            userCountArray.shift();

            //format the current date and add current date to array
            const currentMonth = currentDate.getMonth() + 1;
            const currentDay = currentDate.getDate();
            dateArray.push(`${currentDay}/${currentMonth}`);

            // add the current user count
            userCountArray.push(querySnapshot.size);

            await updateDoc(docRef, { userCount: userCountArray, days: dateArray});
       
          }
          return {days: dateArray, data: userCountArray};
        }
  
      } catch (error){
        console.error(error);
      }
    }
  }
  
  export default AppInfo;