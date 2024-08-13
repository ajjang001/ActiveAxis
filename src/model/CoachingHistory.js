import { db, storage } from '../firebase/firebaseConfig';
import { getDoc, getDocs, query, collection, where, doc, Timestamp, addDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL } from 'firebase/storage';
import Coach from "./Coach";


class CoachingHistory {
    _coachID;
    _endDate;
    _startDate;
    _userID;

    constructor() {
        this._coachID = "";
        this._endDate = "";
        this._startDate = "";
        this._userID = "";
    }

    get coachID() { return this._coachID; }
    get endDate() { return this._endDate; }
    get startDate() { return this._startDate; }
    get userID() { return this._userID; }

    set coachID(coachID) { this._coachID = coachID; }
    set endDate(endDate) { this._endDate = endDate; }
    set startDate(startDate) { this._startDate = startDate; }
    set userID(userID) { this._userID = userID; }

    async getURL(r) {
        try {
            // Get the profile picture URL
            const ppRef = ref(storage, r);
            const ppURL = await getDownloadURL(ppRef);
            return ppURL;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getCurrentSession(userID) {
        try {
            const q = query(collection(db, 'coachinghistory'), where('userID', '==', userID), where('startDate', '<=', Timestamp.now()), where('endDate', '>=', Timestamp.now()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error('No active session found.\nHire a coach to start a session.');
            } else {
                const data = querySnapshot.docs[0].data();

                const historyItem = new CoachingHistory();
                historyItem.coachID = data.coachID;
                historyItem.endDate = data.endDate;
                historyItem.startDate = data.startDate;
                historyItem.userID = data.userID;

                const coach = await new Coach().getInfoByID(data.coachID);


                return { session: { sessionID: querySnapshot.docs[0].id, historyItem }, coach: coach };
            }

        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getUserCoachHistory(userID) {
        try {
            const q = query(collection(db, 'coachinghistory'), where('userID', '==', userID));
            const querySnapshot = await getDocs(q);

            const historyList = [];
            for (const docSnapshot of querySnapshot.docs) {
                const data = docSnapshot.data();
                const coachDocRef = doc(db, 'coach', data.coachID);
                const coachDoc = await getDoc(coachDocRef);
                const coachData = coachDoc.exists() ? coachDoc.data() : {};

                const historyItem = new CoachingHistory();
                historyItem.coachID = data.coachID;
                historyItem.endDate = data.endDate;
                historyItem.startDate = data.startDate;
                historyItem.userID = data.userID;
                historyItem.coachFullName = coachData.fullName;
                historyItem.coachPrice = coachData.chargePerMonth;
                historyItem.coachPhone = coachData.phoneNumber;
                historyItem.coachEmail = coachData.email;

                historyItem.coachPicture = await this.getURL(coachData.profilePicture);

                historyList.push(historyItem);
            }
            return historyList;

        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getCoaches() {
        try {
            const q = query(collection(db, 'coach'), where('isPending', '==', false));
            const queryResult = await getDocs(q);
            const coaches = [];

            for (const doc of queryResult.docs) {
                const data = doc.data();
                const c = new Coach();

                c.accountID = doc.id;
                c.username = data.username;
                c.email = data.email;
                c.profilePicture = data.profilePicture;
                c.profilePicture = await c.getProfilePictureURL();
                c.fullName = data.fullName;
                c.dob = data.dob;
                c.gender = data.gender;
                c.phoneNumber = data.phoneNumber;
                c.isPending = data.isPending;
                c.isSuspended = data.isSuspended;
                c.chargePerMonth = data.chargePerMonth;
                c.certificate = data.certificate;
                c.id = data.photoID;
                c.resume = data.resume;



                coaches.push({ id: doc.id, coach: c });

            }

            return coaches;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async hireCoach(userID, selectedCoach) {
        try {
            console.log('Hiring coach...');

            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 30); // Adds 30 days

            // Assuming you're using Firebase Firestore
            await addDoc(collection(db, 'coachinghistory'), {
                userID: userID,
                coachID: selectedCoach,
                startDate: startDate,
                endDate: endDate,
            });
            console.log('Coach hired successfully!');
        }
        catch (error) {
            console.error('Error hiring coach:', error);
        }
    }

    async getHired(userID) {
        try {
            const q = query(collection(db, 'coachinghistory'), where('userID', '==', userID), where('startDate', '<=', Timestamp.now()), where('endDate', '>=', Timestamp.now()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return false;
            } else {
                const data = querySnapshot.docs[0].data();

                const historyItem = new CoachingHistory();
                historyItem.coachID = data.coachID;
                historyItem.endDate = data.endDate;
                historyItem.startDate = data.startDate;
                historyItem.userID = data.userID;

                const coach = await new Coach().getInfoByID(data.coachID);


                return { session: { sessionID: querySnapshot.docs[0].id, historyItem }, coach: coach };
            }

        } catch (e) {
            throw new Error(e.message);
        }
    }

    async extendHireCoach(endDate, sessionID) {
        try {
            const docRef = doc(db, 'coachinghistory', sessionID);
            // Get the current document snapshot
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

                const currentEndDate = docSnap.data().endDate.toDate(); // Convert Firestore Timestamp to JavaScript Date
                const newEndDate = new Date(currentEndDate);
                newEndDate.setDate(currentEndDate.getDate() + 30);

                // Update the document with the new end date
                await updateDoc(docRef, {
                    endDate: Timestamp.fromDate(newEndDate) // Convert JavaScript Date to Firestore Timestamp
                });

                console.log('Coach hire extended successfully!');
            }
        } catch (error) {
            console.error('Error extending coach hire:', error);
        }
    }

}
export default CoachingHistory;