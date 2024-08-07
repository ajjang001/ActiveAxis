
import { db, storage } from "../firebase/firebaseConfig";
import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import axios from 'axios';

class CoachingFeedback {
    _coachID;
    _dateSubmitted;
    _feedbackText;
    _rating;
    _userID;

    get coachID() { return this._coachID; }
    get dateSubmitted() { return this._dateSubmitted; }
    get feedbackText() { return this._feedbackText; }
    get rating() { return this._rating; }
    get userID() { return this._userID; }

    set coachID(coachID) { this._coachID = coachID; }
    set dateSubmitted(dateSubmitted) { this._dateSubmitted = dateSubmitted; }
    set feedbackText(feedbackText) { this._feedbackText = feedbackText; }
    set rating(rating) { this._rating = rating; }
    set userID(userID) { this._userID = userID; }


    constructor() {
        this._coachID = "";
        this._dateSubmitted = "";
        this._feedbackText = "";
        this._rating = 0;
        this._userID = "";
    }

    async getURL(r) {
        try {
            const ppRef = ref(storage, r);
            const ppURL = await getDownloadURL(ppRef);
            return ppURL;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getCoachFeedbacks(coachID) {
        try {
            // Get all feedbacks for a coach
            const feedbacks = [];
            const q = query(collection(db, 'coachingfeedback'), where('coachID', '==', coachID));
            const queryResult = await getDocs(q);


            for (const d of queryResult.docs) {
                const data = d.data();
                const docRef = doc(db, 'user', data.userID);
                const docSnap = await getDoc(docRef);

                const profilePicRef = ref(storage, docSnap.data().profilePicture);
                const userProfilePicture = await getDownloadURL(profilePicRef);


                feedbacks.push({ fullName: docSnap.data().fullName, profilePicture: userProfilePicture, rating: data.rating, feedbackText: data.feedbackText });
            }


            return feedbacks;

        } catch (e) {
            throw new Error(e.message);
        }
    }

    // For CoacheeFeedbackPage
    async getCoacheeFeedbacks(coachEmail) {
        //get doc.id for coach first
        const coachQuery = query(collection(db, 'coach'), where('email', '==', coachEmail));
        const coachSnapshot = await getDocs(coachQuery);
        const coachDoc = coachSnapshot.docs[0];
        const coachID = coachDoc.id;

        // Get all feedbacks for a coach
        const feedbacks = [];
        const q = query(collection(db, 'coachingfeedback'), where('coachID', '==', coachID));
        const queryResult = await getDocs(q);
        for (const d of queryResult.docs) {
            const data = d.data();
            const docRef = doc(db, 'user', data.userID);
            const docSnap = await getDoc(docRef);

            const profilePicRef = ref(storage, docSnap.data().profilePicture);
            const userProfilePicture = await getDownloadURL(profilePicRef);


            feedbacks.push({ fullName: docSnap.data().fullName, profilePicture: userProfilePicture, rating: data.rating, feedbackText: data.feedbackText });
        }


        return feedbacks;

    } catch(e) {
        throw new Error(e.message);
    }

    async getUserCoachFeedback(userID, coachID) {
        try {
            const q = query(collection(db, 'coachingfeedback'), where('userID', '==', userID), where('coachID', '==', coachID));
            const querySnapshot = await getDocs(q);

            const feedback = [];
            for (const docSnapshot of querySnapshot.docs) {
                const data = docSnapshot.data();
                const userDoc = await getDoc(doc(db, 'user', userID));
                const userData = userDoc.exists() ? userDoc.data() : {};

                let userProfilePicture = "";
                if (userData.profilePicture) {
                    userProfilePicture = await this.getURL(userData.profilePicture);
                }

                const feedbackItem = {
                    id: docSnapshot.id, // Include the document ID
                    fullName: userData.fullName,
                    profilePicture: userProfilePicture,
                    rating: data.rating,
                    feedbackText: data.feedbackText,
                };

                feedback.push(feedbackItem);
            }
            return feedback;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async submitUserCoachFeedback(feedbackData) {
        const feedbackCollection = collection(db, 'coachingfeedback');
        await addDoc(feedbackCollection, feedbackData);
    }

    async updateUserCoachFeedback(feedbackID, feedbackData) {
        try {
            // Reference to the specific document in the 'coachingfeedback' collection
            const feedbackDocRef = doc(db, 'coachingfeedback', feedbackID);
            // Update the document with the new data
            await setDoc(feedbackDocRef, feedbackData, { merge: true });
            console.log("Feedback updated successfully.");
        } catch (e) {
            console.error("Error updating feedback: ", e.message);
            throw new Error(e.message);
        }
    }
}


export default CoachingFeedback;