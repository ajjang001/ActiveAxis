
import { app, auth, db, storage } from '../../.expo/api/firebase.js';
import { getDocs, collection, orderBy } from 'firebase/firestore';



class ExerciseType{
    _exerciseTypeID;
    _exerciseTypeName;

    constructor (){}

    get exerciseTypeID() {return this._exerciseTypeID;}
    get exerciseTypeName() {return this._exerciseTypeName;}

    set exerciseTypeID(exerciseTypeID) {this._exerciseTypeID = exerciseTypeID;}
    set exerciseTypeName(exerciseTypeName) {this._exerciseTypeName = exerciseTypeName;}

    async getExerciseType(){
        try{
            const types = [];
            const querySnapshot = await getDocs(collection(db, 'exercisetype'));
            
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                const t = new ExerciseType();
                t.exerciseTypeID = d.exerciseTypeID;
                t.exerciseTypeName = d.exerciseTypeName;
                types.push(t);
            });
            return types;
        }catch(error){
            throw new Error (error);
        }
    }
}

export default ExerciseType;