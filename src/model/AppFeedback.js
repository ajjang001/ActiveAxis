
import { db, storage } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc, query, where, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

import Coach from './Coach';
import User from './User';

class AppFeedback{
    _feedbackID;
    _dateSubmitted;
    _feedbackText;
    _rating
    _accountID
    _avatar
    _fullName
    _profilePicture

    get feedbackID(){return this._feedbackID;}
    get dateSubmitted(){return this._dateSubmitted;}
    get feedbackText(){return this._feedbackText;}
    get rating(){return this._rating;}
    get accountID(){return this._accountID;}
    get avatar(){return this._avatar;}
    get fullName(){return this._fullName;}
    get profilePicture(){return this._profilePicture;}

    set feedbackID(feedbackID){this._feedbackID = feedbackID;}
    set dateSubmitted(dateSubmitted){this._dateSubmitted = dateSubmitted;}
    set feedbackText(feedbackText){this._feedbackText = feedbackText;}
    set rating(rating){this._rating = rating;}
    set accountID(accountID){this._accountID = accountID;}
    set avatar(avatar){this._avatar = avatar;}
    set fullName(fullName){this._fullName = fullName;}
    set profilePicture(profilePicture){this._profilePicture = profilePicture;}

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

                const u = new User();
                u.profilePicture = userData.profilePicture;
                feedback.profilePicture = await u.getProfilePictureURL();
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

      async fetchFeedbacks() {
        try{
            const feedbacks = [];
            const q = query(collection(db, 'appfeedback'));
            const querySnapshot = await getDocs(q);

            for(const d of querySnapshot.docs){
                const feedback = new AppFeedback();
                const data = d.data();

                feedback.feedbackID = d.id;
                feedback.dateSubmitted = data.dateSubmitted;
                feedback.feedbackText = data.feedbackText;
                feedback.rating = data.rating;
                feedback.accountID = data.accountID;

                const docRef = await getDoc(doc(db, 'user', data.accountID));
                if (docRef.exists()) {
                    const userData = docRef.data();
                    feedback.fullName = userData.fullName;
                    feedback.profilePicture = userData.profilePicture;

                    const u = new User();
                    u.profilePicture = userData.profilePicture;
                    feedback.profilePicture = await u.getProfilePictureURL();
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

                feedbacks.push(feedback);
            }
            return feedbacks;
        }catch(error){
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