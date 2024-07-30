import Achievements from "./Achievements";
import AchievementType from "./AchievementType";
import { db, storage } from '../firebase/firebaseConfig';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

class AchievementsObtained {
    _achievementID;
    _dateAchieved;
    _userID;

    constructor() {
        this._achievementID = "";
        this._dateAchieved = "";
        this._userID = "";
    }

    get achievementID() { return this._achievementID; }
    get dateAchieved() { return this._dateAchieved; }
    get userID() { return this._userID; }

    set achievementID(achievementID) { this._achievementID = achievementID; }
    set dateAchieved(dateAchieved) { this._dateAchieved = dateAchieved; }
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

    async getAllAchievements() {
        try {
            const achievementsCollection = collection(db, 'achievements');
            const querySnapshot = await getDocs(achievementsCollection);

            if (!querySnapshot.empty) {
                // Map over the documents to get their data
                const achievementsPromises = querySnapshot.docs.map(async doc => {
                    const data = doc.data();
                    const a = new Achievements();

                    a.achievementID = doc.id;
                    a.achievementType = await new AchievementType().getAchievementType(data.achievementTypeID);
                    a.achievementName = data.achievementName;
                    a.description = data.description;
                    a.achievementPicture = await this.getURL(data.achievementPicture);

                    return a;
                });

                const achievements = await Promise.all(achievementsPromises);
                return achievements; // Return an array of achievements
            } else {
                return []; // Return an empty array if no achievements are found
            }
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async getUserAchievements(userID) {
        try {
            const q = query(collection(db, 'achievementsobtained'), where('userID', '==', userID));
            const queryResult = await getDocs(q);

            if (!queryResult.empty) {
                // Map over the documents to get their data
                const achievements = queryResult.docs.map(doc => {
                    const data = doc.data();
                    const a = new AchievementsObtained();

                    a.achievementID = data.achievementID;
                    a.dateAchieved = data.dateAchieved;
                    a.userID = data.userID;

                    return a;
                });
                return achievements; // Return an array of achievements
            } else {
                return []; // Return an empty array if no achievements are found
            }
        } catch (e) {
            throw new Error(e.message);
        }
    }
}
export default AchievementsObtained;