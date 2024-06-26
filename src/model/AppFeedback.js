import {db, storage} from '../../.expo/api/firebase';

import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

class AppFeedback{
    #dateSubmitted;
    #feedbackText;
    #rating
    #userID
    #avatar
    #fullName
    #profilePicture

    get dateSubmitted(){return this.#dateSubmitted;}
    get feedbackText(){return this.#feedbackText;}
    get rating(){return this.#rating;}
    get userID(){return this.#userID;}
    get avatar(){return this.#avatar;}
    get fullName(){return this.#fullName;}
    get profilePicture(){return this.#profilePicture;}

    set dateSubmitted(dateSubmitted){this.#dateSubmitted = dateSubmitted;}
    set feedbackText(feedbackText){this.#feedbackText = feedbackText;}
    set rating(rating){this.#rating = rating;}
    set userID(userID){this.#userID = userID;}
    set avatar(avatar){this.#avatar = avatar;}
    set fullName(fullName){this.#fullName = fullName;}
    set profilePicture(profilePicture){this.#profilePicture = profilePicture;}

    constructor(dateSubmitted, feedbackText, rating, userID, avatar, fullName, profilePicture) {
        this.dateSubmitted = dateSubmitted;
        this.feedbackText = feedbackText;
        this.rating = rating;
        this.userID = userID;
        this.avatar = avatar;
        this.fullName = fullName;
        this.profilePicture = profilePicture;
      }
    
      static async fetchFeedbacks() {
        try {
          const feedbacksCollection = collection(db, 'appfeedback');
          const feedbackSnapshot = await getDocs(feedbacksCollection);
          const feedbackList = await Promise.all(feedbackSnapshot.docs.map(async (feedbackDoc) => {
            const data = feedbackDoc.data();
            let userFullName = '';
            let userProfilePicture = '';
    
            // Fetch user details
            if (data.userID) {
              const userDocRef = doc(db, 'user', data.userID);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                const userData = userDoc.data();
                userFullName = userData.fullName;
                userProfilePicture = userData.profilePicture;
                if (userProfilePicture) {
                  try {
                    const profilePicRef = ref(storage, userProfilePicture);
                    userProfilePicture = await getDownloadURL(profilePicRef);
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
            }
    
            return new AppFeedback(data.dateSubmitted, data.feedbackText, data.rating, data.userID, data.avatar, userFullName, userProfilePicture);
          }));
          return feedbackList;
        } catch (error) {
          throw new Error("Error fetching feedbacks: " + error.message);
        }
      }
    }

export default AppFeedback;