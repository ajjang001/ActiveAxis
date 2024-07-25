
import { db, storage } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

class AppFeedback{
    #dateSubmitted;
    #feedbackText;
    #rating
    #accountID
    #avatar
    #fullName
    #profilePicture

    get dateSubmitted(){return this.#dateSubmitted;}
    get feedbackText(){return this.#feedbackText;}
    get rating(){return this.#rating;}
    get accountID(){return this.#accountID;}
    get avatar(){return this.#avatar;}
    get fullName(){return this.#fullName;}
    get profilePicture(){return this.#profilePicture;}

    set dateSubmitted(dateSubmitted){this.#dateSubmitted = dateSubmitted;}
    set feedbackText(feedbackText){this.#feedbackText = feedbackText;}
    set rating(rating){this.#rating = rating;}
    set accountID(accountID){this.#accountID = accountID;}
    set avatar(avatar){this.#avatar = avatar;}
    set fullName(fullName){this.#fullName = fullName;}
    set profilePicture(profilePicture){this.#profilePicture = profilePicture;}

    constructor(dateSubmitted, feedbackText, rating, accountID, avatar, fullName, profilePicture) {
        this.dateSubmitted = dateSubmitted;
        this.feedbackText = feedbackText;
        this.rating = rating;
        this.accountID = accountID;
        this.avatar = avatar;
        this.fullName = fullName;
        this.profilePicture = profilePicture;
      }
      
      static async fetchFeedbackById(feedbackId) {
        try {
            const feedbackDocRef = doc(db, 'appfeedback', feedbackId);
            const feedbackDoc = await getDoc(feedbackDocRef);
    
            if (!feedbackDoc.exists()) {
                throw new Error('Feedback not found');
            }
    
            const data = feedbackDoc.data();
            const id = feedbackDoc.id;
            let userFullName = '';
            let userProfilePicture = '';
    
            if (data.accountID) {
                let userDocRef = doc(db, 'user', data.accountID);
                let userDoc = await getDoc(userDocRef);
    
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    userFullName = userData.fullName || '';
                    userProfilePicture = userData.profilePicture || '';
    
                    if (userProfilePicture) {
                        try {
                            const profilePicRef = ref(storage, userProfilePicture);
                            userProfilePicture = await getDownloadURL(profilePicRef);
                        } catch (error) {
                            throw new Error("Error fetching profile picture: " + error.message);
                        }
                    }
                } else {
                    userDocRef = doc(db, 'coach', data.accountID);
                    userDoc = await getDoc(userDocRef);
    
                    if (userDoc.exists()) {
                        const coachData = userDoc.data();
                        userFullName = coachData.fullName || '';
                        userProfilePicture = coachData.profilePicture || '';
    
                        if (userProfilePicture) {
                            try {
                                const profilePicRef = ref(storage, userProfilePicture);
                                userProfilePicture = await getDownloadURL(profilePicRef);
                            } catch (error) {
                                throw new Error("Error fetching profile picture: " + error.message);
                            }
                        }
                    }
                }
            }
    
            return new AppFeedback(data.dateSubmitted, data.feedbackText, data.rating, data.accountID, data.avatar, userFullName, userProfilePicture, id);
        } catch (error) {
            throw new Error("Error fetching feedback: " + error.message);
        }
    }
    

      async fetchFeedbacks() {
        try {
          // Fetch feedbacks
          const feedbacksCollection = collection(db, 'appfeedback');
          const feedbackSnapshot = await getDocs(feedbacksCollection);

          // Fetch user details
          const feedbackList = await Promise.all(feedbackSnapshot.docs.map(async (feedbackDoc) => {
            const data = feedbackDoc.data();
            let userFullName = '';
            let userProfilePicture = '';
    
            // Fetch user details
            if (data.accountID) {
              let userDocRef = doc(db, 'user', data.accountID);
              let userDoc = await getDoc(userDocRef);

              // Check if user exists
              if (userDoc.exists()) {
                const userData = userDoc.data();
                userFullName = userData.fullName;
                userProfilePicture = userData.profilePicture;

                // Fetch profile picture
                if (userProfilePicture) {
                  try {
                    const profilePicRef = ref(storage, userProfilePicture);
                    userProfilePicture = await getDownloadURL(profilePicRef);
                  } catch (error) {
                    throw new Error("Error fetching profile picture: " + error.message);
                  }
                }
              }else{
                // Check if user is a coach
                userDocRef = doc(db, 'coach', data.accountID);
                userDoc = await getDoc(userDocRef);

                if(userDoc.exists()){
                  // Fetch coach details
                  const coachData = userDoc.data();
                  userFullName = coachData.fullName;
                  userProfilePicture = coachData.profilePicture;

                  // Fetch profile picture
                  if (userProfilePicture) {
                    try {
                      const profilePicRef = ref(storage, userProfilePicture);
                      userProfilePicture = await getDownloadURL(profilePicRef);
                    } catch (error) {
                      throw new Error("Error fetching profile picture: " + error.message);
                    }
                  }

                }

              }


            }
    
            return new AppFeedback(data.dateSubmitted, data.feedbackText, data.rating, data.accountID, data.avatar, userFullName, userProfilePicture);
          }));
          return feedbackList;
        } catch (error) {
          throw new Error("Error fetching feedbacks: " + error.message);
        }
      }
      async updateFeedback(feedbackId, updatedFeedback) {
        try {
            const feedbackDocRef = doc(db, 'appfeedback', feedbackId);
            await updateDoc(feedbackDocRef, {
                feedbackText: updatedFeedback.feedbackText,
                rating: updatedFeedback.rating,
                dateSubmitted: updatedFeedback.dateSubmitted,
                accountID: updatedFeedback.accountID,
                avatar: updatedFeedback.avatar,
                fullName: updatedFeedback.fullName,
                profilePicture: updatedFeedback.profilePicture,
            });
        } catch (error) {
            throw new Error("Error updating feedback: " + error.message);
        }
    }
    }

export default AppFeedback;