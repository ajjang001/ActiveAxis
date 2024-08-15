
import { auth, db, storage } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { addDoc, getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import WorkoutRoutine from "./WorkoutRoutine";
import FitnessPlan from './FitnessPlan';

class ExerciseHistory{
    _userID;
    _routine;
    _dayNumber;
    _estCaloriesBurned;
    _dateCompleted;

    constructor(){
        this._userID = '';
        this._routine = '';
        this._dayNumber = 0;
        this._dateCompleted = null;
    }

    get userID(){return this._userID;}
    get routine(){return this._routine;}
    get dayNumber(){return this._dayNumber;}
    get estCaloriesBurned(){return this._estCaloriesBurned;}
    get dateCompleted(){return this._dateCompleted;}
    
    set userID(value){this._userID = value;}
    set routine(value){this._routine = value;}
    set dayNumber(value){this._dayNumber = value;}
    set estCaloriesBurned(value){this._estCaloriesBurned = value;}
    set dateCompleted(value){this._dateCompleted = value;}

    async addExerciseHistory(caloriesKcal, userID, routineID, dayNumber){
        try{

            const docRef = await addDoc(collection(db, 'exercisehistory'), {
                userID: userID,
                routineID: routineID,
                dayNumber: dayNumber,
                estCaloriesBurned:caloriesKcal,
                dateCompleted: Timestamp.fromDate(new Date())
            });

            return docRef.id;

        }catch(error){
            throw new Error(error);
        }
    }

    async getExerciseHistory(date, userID){
        try{
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const q = query(
                collection(db, 'exercisehistory'),
                where('userID', '==', userID),
                where('dateCompleted', '>=', Timestamp.fromDate(startOfDay)),
                where('dateCompleted', '<=', Timestamp.fromDate(endOfDay))
              );

            const querySnapshot = await getDocs(q);
            
            let exerciseHistoryArr = [];
            for(const d of querySnapshot.docs){
                const data = d.data();
                const exerciseHistory = new ExerciseHistory();

                exerciseHistory.userID = data.userID;

                // get fitness plan name from routineID
                const docRef = doc(db, 'workoutroutine', data.routineID);
                const docSnap = await getDoc(docRef);
                const routineData = docSnap.data();
                
                const fpRef = doc(db, 'fitnessplan', routineData.fitnessPlanID);
                const fpSnap = await getDoc(fpRef);
                const fpData = fpSnap.data();

                const fp = new FitnessPlan();
                fp.fitnessPlanPicture=fpData.fitnessPlanPicture;
                fp.fitnessPlanPicture = await fp.getFitnessPlanPicture();

                exerciseHistory.routine = {fitnessPlanID: routineData.fitnessPlanID, fitnessPlanName: fpData.fitnessPlanName, fitnessPlanPicture: fp.fitnessPlanPicture};


                exerciseHistory.dayNumber = data.dayNumber;
                exerciseHistory.estCaloriesBurned = data.estCaloriesBurned;
                exerciseHistory.dateCompleted = data.dateCompleted;

                exerciseHistoryArr.push(exerciseHistory);
            }

            return exerciseHistoryArr;

        }catch(error){
            console.log(error);
            throw new Error(error);
        }
    }

}

export default ExerciseHistory;