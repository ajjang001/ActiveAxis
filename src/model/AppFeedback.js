
import { db, storage } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import Coach from './Coach';

class AppFeedback{
    #feedbackID;
    #dateSubmitted;
    #feedbackText;
    #rating
    #accountID
    #avatar
    #fullName
    #profilePicture

    get feedbackID(){return this.#feedbackID;}
    get dateSubmitted(){return this.#dateSubmitted;}
    get feedbackText(){return this.#feedbackText;}
    get rating(){return this.#rating;}
    get accountID(){return this.#accountID;}
    get avatar(){return this.#avatar;}
    get fullName(){return this.#fullName;}
    get profilePicture(){return this.#profilePicture;}

    set feedbackID(feedbackID){this.#feedbackID = feedbackID;}
    set dateSubmitted(dateSubmitted){this.#dateSubmitted = dateSubmitted;}
    set feedbackText(feedbackText){this.#feedbackText = feedbackText;}
    set rating(rating){this.#rating = rating;}
    set accountID(accountID){this.#accountID = accountID;}
    set avatar(avatar){this.#avatar = avatar;}
    set fullName(fullName){this.#fullName = fullName;}
    set profilePicture(profilePicture){this.#profilePicture = profilePicture;}

    constructor() {
        this.dateSubmitted = '';
        this.feedbackText = '';
        this.rating = 0;
        this.accountID = '';
        this.avatar = '';
        this.fullName = '';
        this.profilePicture = '';
      }
      
    

      async fetchFeedback(accountID) {
        try {
          // Fetch feedbacks
          let q = query(collection(db, "appfeedback"), where("accountID", "==", accountID));
          const querySnapshot = await getDocs(q);

          // expected 1 result
          if (!querySnapshot.empty) {
            const feedback = new AppFeedback();
            
            const data = querySnapshot.docs[0].data();
            
            feedback.feedbackID = querySnapshot.docs[0].id;
            feedback.dateSubmitted = data.dateSubmitted;
            feedback.feedbackText = data.feedbackText;
            feedback.rating = data.rating;
            feedback.accountID = data.accountID;

            const docRef = await getDoc(doc(db, 'user', data.accountID));
            if (docRef.exists()) {
                const userData = docRef.data();
                feedback.fullName = userData.fullName;
                feedback.profilePicture = userData.profilePicture;
            }else{
                const coachDocRef = await getDoc(doc(db, 'coach', data.accountID));
                if (coachDocRef.exists()) {
                    const coachData = coachDocRef.data();
                    feedback.fullName = coachData.fullName;
                    feedback.profilePicture = coachData.profilePicture;

                    const c = new Coach();
                    c.profilePicture = coachData.profilePicture;
                    feedback.profilePicture = await c.getProfilePictureURL();
                }
            }

            return feedback;
          }else{
            return null;
          }
        } catch (error) {
          throw new Error(error.message);
        }
      }
      async updateFeedback(feedbackText, rating) {
        try {
            const feedbackDocRef = doc(db, 'appfeedback', this.feedbackID);
            await updateDoc(feedbackDocRef, {
                feedbackText: feedbackText,
                rating: rating,
                dateSubmitted: Timestamp.now()
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
    }

export default AppFeedback;