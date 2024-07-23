
import { db, storage } from "../firebase/firebaseConfig";
import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import axios from 'axios';

class CoachingFeedback {
    #coachID;
    #dateSubmitted;
    #feedbackText;
    #rating;
    #userID;

    get coachID() { return this.#coachID; }
    get dateSubmitted() { return this.#dateSubmitted; }
    get feedbackText() { return this.#feedbackText; }
    get rating() { return this.#rating; }
    get userID() { return this.#userID; }

    set coachID(coachID) { this.#coachID = coachID; }
    set dateSubmitted(dateSubmitted) { this.#dateSubmitted = dateSubmitted; }
    set feedbackText(feedbackText) { this.#feedbackText = feedbackText; }
    set rating(rating) { this.#rating = rating; }
    set userID(userID) { this.#userID = userID; }


    constructor() {
        this.#coachID = "";
        this.#dateSubmitted = "";
        this.#feedbackText = "";
        this.#rating = 0;
        this.#userID = "";
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
}

export default CoachingFeedback;