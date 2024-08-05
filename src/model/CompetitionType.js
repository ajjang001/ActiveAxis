import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';

class CompetitionType {
    _competitionTypeID;
    _competitionTypeName;

    constructor() {
        this._competitionTypeID = "";
        this._competitionTypeName = "";
    }

    get competitionTypeID() { return this._competitionTypeID; }
    get competitionTypeName() { return this._competitionTypeName; }

    set competitionTypeID(competitionTypeID) { this._competitionTypeID = competitionTypeID; }
    set competitionTypeName(competitionTypeName) { this._competitionTypeName = competitionTypeName; }

    async getCompetitionType (typeID) {
        try{
            const docRef = query(collection(db, 'competitiontype'), where('competitionTypeID', '==', typeID));
            const docSnap = await getDocs(docRef);
            if (!docSnap.empty) {
                const docData = docSnap.docs[0].data();
                const type = new CompetitionType();
                type.competitionTypeID = docData.competitionTypeID;
                type.competitionTypeName = docData.competitionTypeName;
                return type;
            }
        }catch(error){
            throw new Error(error);
        }
    }

    async getCompetitionTypes() {
        try {
            const types = [];
            const querySnapshot = await getDocs(collection(db, 'competitiontype'));
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                console.log('Fetched document:', d);  // Debug log
                const type = new CompetitionType();
                type.competitionTypeID = d.competitionTypeID;
                type.competitionTypeName = d.competitionTypeName;
                types.push(type);
            });
            return types;
        } catch (error) {
            throw new Error(error);
        }
    }

    async addCompetitionType(newTypeName) {
        try {
            // Fetch the current maximum competitionTypeID
            const querySnapshot = await getDocs(collection(db, 'competitiontype'));
            let maxID = 0;
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                if (d.competitionTypeID > maxID) {
                    maxID = d.competitionTypeID;
                }
            });

            const newTypeID = maxID + 1;
            const newType = {
                competitionTypeID: newTypeID,
                competitionTypeName: newTypeName,
            };
            const docRef = await addDoc(collection(db, 'competitiontype'), newType);
            return newTypeID; // Return the new incremented ID
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateCompetitionType(typeID, updatedTypeName) {
        try {
            const querySnapshot = await getDocs(collection(db, 'competitiontype'));
            let docID = null;
            querySnapshot.forEach((doc) => {
                if (doc.data().competitionTypeID === typeID) {
                    docID = doc.id;
                }
            });
            if (docID) {
                const typeRef = doc(db, 'competitiontype', docID);
                await updateDoc(typeRef, { competitionTypeName: updatedTypeName });
            } else {
                throw new Error('Document with given competitionTypeID not found');
            }
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default CompetitionType;

