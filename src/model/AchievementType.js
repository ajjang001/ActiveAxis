
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, orderBy, where, query } from 'firebase/firestore';

class AchievementType{
    _achievementTypeID;
    _achievementTypeName;

    constructor (){}

    get achievementTypeID() {return this._achievementTypeID;}
    get achievementTypeName() {return this._achievementTypeName;}

    set achievementTypeID(achievementTypeID) {this._achievementTypeID = achievementTypeID;}
    set achievementTypeName(achievementTypeName) {this._achievementTypeName = achievementTypeName;}

    async getAchievementType(achievementTypeID){
        try{
            
            const q = query(collection(db, 'achievementtype'), where('achievementTypeID', '==', achievementTypeID));
            const querySnapshot = await getDocs(q);


            if (querySnapshot.empty) {
                return null;
            }else{
                const doc = querySnapshot.docs[0];
                const d = doc.data();
                return d.achievementTypeName;
            }
        }catch(error){
            throw new Error (error);
        }
    }

    async getAchievementTypes(){
        try{
            const types = [];
            const querySnapshot = await getDocs(collection(db, 'achievementtype'), orderBy('achievementTypeID'));
            
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                const t = new AchievementType();
                t.achievementTypeID = d.achievementTypeID;
                t.achievementTypeName = d.achievementTypeName;
                types.push(t);
            });

            // sort the array by achievementTypeName
            types.sort((a, b) => {
                return a.achievementTypeName.localeCompare(b.achievementTypeName);
            });

            return types;
        }catch(error){
            throw new Error (error);
        }
    }
}

export default AchievementType;