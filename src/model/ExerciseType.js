
import { app, auth, db, storage } from '../../.expo/api/firebase.js';
import { getDocs, collection, orderBy, where, query } from 'firebase/firestore';

class ExerciseType{
    _exerciseTypeID;
    _exerciseTypeName;

    constructor (){}

    get exerciseTypeID() {return this._exerciseTypeID;}
    get exerciseTypeName() {return this._exerciseTypeName;}

    set exerciseTypeID(exerciseTypeID) {this._exerciseTypeID = exerciseTypeID;}
    set exerciseTypeName(exerciseTypeName) {this._exerciseTypeName = exerciseTypeName;}

    async getExerciseType(exerciseTypeID){
        try{
            const q = query(collection(db, 'exercisetype'), where('exerciseTypeID', '==', exerciseTypeID));
            const querySnapshot = await getDocs(q);


            if (querySnapshot.empty) {
                return null;
            }else{
                const doc = querySnapshot.docs[0];
                const d = doc.data();
                return d.exerciseTypeName;
            }
        }catch(error){
            throw new Error (error);
        }
    }

    async getExerciseTypes(){
        try{
            const types = [];
            const querySnapshot = await getDocs(collection(db, 'exercisetype'), orderBy('exerciseTypeID'));
            
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                const t = new ExerciseType();
                t.exerciseTypeID = d.exerciseTypeID;
                t.exerciseTypeName = d.exerciseTypeName;
                types.push(t);
            });

            // sort the array by exerciseTypeName
            types.sort((a, b) => {
                return a.exerciseTypeName.localeCompare(b.exerciseTypeName);
            });

            return types;
        }catch(error){
            throw new Error (error);
        }
    }
}

export default ExerciseType;