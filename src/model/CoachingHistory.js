import { db, storage } from '../firebase/firebaseConfig';
import { getDoc, getDocs, query, collection, where, doc } from "firebase/firestore";
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

}
export default CoachingHistory;