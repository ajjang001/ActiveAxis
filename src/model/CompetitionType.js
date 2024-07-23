
import { db } from '../firebase/firebaseConfig';
import { getDocs, collection, orderBy, where, query } from 'firebase/firestore';

class CompetitionType{
    _competitionTypeID;
    _competitionTypeName;

    constructor (){
        this._competitionTypeID = 0;
        this._competitionTypeName = "";
    }

    get competitionTypeID() {return this._competitionTypeID;}
    get competitionTypeName() {return this._competitionTypeName;}

    set competitionTypeID(competitionTypeID) {this._competitionTypeID = competitionTypeID;}
    set competitionTypeName(competitionTypeName) {this._competitionTypeName = competitionTypeName;}

    async getCompetitionType(competitionTypeID){
        try{
            
            const q = query(collection(db, 'competitiontype'), where('competitionTypeID', '==', competitionTypeID));
            const querySnapshot = await getDocs(q);


            if (querySnapshot.empty) {
                return null;
            }else{
                const doc = querySnapshot.docs[0];
                const d = doc.data();
                return d.competitionTypeName;
            }
        }catch(error){
            throw new Error (error);
        }
    }

    async getCompetitionTypes(){
        try{
            const types = [];
            const querySnapshot = await getDocs(collection(db, 'competitiontype'), orderBy('competitionTypeID'));
            
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                const t = new CompetitionType();
                t.competitionTypeID = d.competitionTypeID;
                t.competitionTypeName = d.competitionTypeName;
                types.push(t);
            });

            // sort the array by competitionTypeName
            types.sort((a, b) => {
                return a.competitionTypeName.localeCompare(b.competitionTypeName);
            });

            return types;
        }catch(error){
            throw new Error (error);
        }
    }
}

export default CompetitionType;