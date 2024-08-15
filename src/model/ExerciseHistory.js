
import { auth, db, storage } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { addDoc, getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

class ExerciseHistory{
    _userID;
    _routineID;
    _dayNumber;
    _estCaloriesBurned;
    _dateCompleted;

    constructor(){
        this._userID = '';
        this._routineID = '';
        this._dayNumber = 0;
        this._dateCompleted = null;
    }

    get userID(){return this._userID;}
    get routineID(){return this._routineID;}
    get dayNumber(){return this._dayNumber;}
    get estCaloriesBurned(){return this._estCaloriesBurned;}
    get dateCompleted(){return this._dateCompleted;}
    
    set userID(value){this._userID = value;}
    set routineID(value){this._routineID = value;}
    set dayNumber(value){this._dayNumber = value;}
    set estCaloriesBurned(value){this._estCaloriesBurned = value;}
    set dateCompleted(value){this._dateCompleted = value;}

    async addExerciseHistory(caloriesKcal, userID, routineID, dayNumber){
        try{

            const docRef = await addDoc(collection(db, 'exercisehistory'), {
                userID: userID,
                routineID: routineID,
                dayNumber: dayNumber,
                estCaloresBurned:caloriesKcal,
                dateCompleted: Timestamp.fromDate(new Date())
            });

            return docRef.id;

        }catch(error){
            throw new Error(error);
        }
    }

}

export default ExerciseHistory;