
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, doc, addDoc, updateDoc, orderBy, where, query } from 'firebase/firestore';

class AchievementType{
    _achievementTypeID;
    _achievementTypeName;

    constructor (){
        this._achievementTypeID = 0;
        this._achievementTypeName = "";
    }

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

    async addAchievementType(newTypeName){
        try{
            // Fetch the current maximum achievementTypeID
            const querySnapshot = await getDocs(collection(db, 'achievementtype'));
            let maxID = 0;
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                if (d.achievementTypeID > maxID) {
                    maxID = d.achievementTypeID;
                }
            });

            const newTypeID = maxID + 1;
            const newType = {
                achievementTypeID: newTypeID,
                achievementTypeName: newTypeName,
            };
            const refDoc = await addDoc(collection(db, 'achievementtype'), newType);
            return newTypeID; // Return the new incremented ID
        } catch(error){
            throw new Error(error);
        }
    }

    async updateAchievementType(typeID, updatedTypeName){
        try{
            const querySnapshot = await getDocs(collection(db, 'achievementtype'));
            let docID = null;
            querySnapshot.forEach((doc) => {
                if (doc.data().achievementTypeID === typeID) {
                    docID = doc.id;
                }
            });
            if (docID) {
                const typeRef = doc(db, 'achievementtype', docID);
                await updateDoc(typeRef, { achievementTypeName: updatedTypeName });
            } else {
                throw new Error('Document with given achievementTypeID not found');
            }
        } catch(error){
            throw new Error(error);
        }
    }
}

export default AchievementType;