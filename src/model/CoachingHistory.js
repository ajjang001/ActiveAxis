import { db, storage } from '../firebase/firebaseConfig';
import { getDoc, getDocs, query, collection, where, doc } from "firebase/firestore";
import { ref, getDownloadURL } from 'firebase/storage';

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

}
export default CoachingHistory;