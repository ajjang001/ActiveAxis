import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {auth, db, storage} from '../firebase/firebaseConfig';
import axios from "axios";

import Exercise from "./Exercise";

import {
    NUTRITIONIX_API_KEY,
    NUTRITIONIX_APP_ID
} from "@env";

class WorkoutRoutine{
    _routineID;
    _fitnessPlanID;
    _dayNumber;
    _exercisesList;
    _estCaloriesBurned;
    _isRestDay;

    get routineID(){ return this._routineID; }
    get fitnessPlanID(){ return this._fitnessPlanID; }
    get dayNumber(){ return this._dayNumber; }
    get exercisesList(){ return this._exercisesList; }
    get estCaloriesBurned(){ return this._estCaloriesBurned; }
    get isRestDay(){ return this._isRestDay; }

    set routineID(routineID){ this._routineID = routineID; }
    set fitnessPlanID(fitnessPlanID){ this._fitnessPlanID = fitnessPlanID; }
    set dayNumber(dayNumber){ this._dayNumber = dayNumber; }
    set exercisesList(exercisesList){ this._exercisesList = exercisesList; }
    set estCaloriesBurned(estCaloriesBurned){ this._estCaloriesBurned = estCaloriesBurned; }
    set isRestDay(isRestDay){ this._isRestDay = isRestDay; }

    constructor(){
        this._routineID = '';
        this._fitnessPlanID = '';
        this._dayNumber = 0;
        this._exercisesList = [];
        this._estCaloriesBurned = 0;
        this._isRestDay = false;
    }

    // Custom clone method for deep copying
    clone() {
        const clone = new WorkoutRoutine();
        clone.routineID = this.routineID;
        clone.fitnessPlanID = this.fitnessPlanID;
        clone.dayNumber = this.dayNumber;
        clone.exercisesList = this.exercisesList.map(exercise => ({duration: exercise.duration, sets:exercise.sets, exercise: exercise.exercise.clone()}));
        clone.estCaloriesBurned = this.estCaloriesBurned;
        clone.isRestDay = this.isRestDay;
        return clone;
    }

    addExerciseToList(alarmString, exercise, sets){
        this._exercisesList.push({duration: alarmString, sets, exercise});
    }

    async calculateCaloriesBurned(){
        try{
            let query = '';

            for (const exercise of this._exercisesList) {
                const duration = exercise.duration.split(':');
                const minutes = parseInt(duration[0]);
                const seconds = parseInt(duration[1]) + (minutes * 60);
                query += `- ${exercise.exercise.exerciseName} (${exercise.sets} sets x ${seconds} seconds)\n`;
            }


            const response = await axios.post(
                'https://trackapi.nutritionix.com/v2/natural/exercise',
                {query: query},
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'x-app-id': NUTRITIONIX_APP_ID,
                        'x-app-key': NUTRITIONIX_API_KEY
                    }
                }
            );

            this._estCaloriesBurned = response.data.exercises.reduce((acc, exercise) => acc + exercise.nf_calories, 0);
        }catch(error){
            throw new Error(error);
        }
    }

    async createWorkoutRoutine(routines, fitnessPlanID){
        try{
            const routineIDsList = [];
            for (const routine of routines) {
                const docRef = await addDoc(collection(db, 'workoutroutine'), {
                    fitnessPlanID: fitnessPlanID,
                    dayNumber: routine.dayNumber,
                    estCaloriesBurned: routine.estCaloriesBurned,
                    isRestDay: routine.isRestDay
                });

                routineIDsList.push(docRef.id);

            }

            return routineIDsList;

        }catch(error){
            throw new Error( 'create wr ' + error);
        }
    }

    async updateWorkoutRoutine(routines, fitnessPlanID){
        try{
            let routineIDsList = [];

            // Remove old workoutroutines
            const q = query(collection(db, 'workoutroutine'), where("fitnessPlanID", "==", fitnessPlanID));
            const querySnapshot = await getDocs(q);

            for (const doc of querySnapshot.docs) {
                routineIDsList.push(doc.id);
                await deleteDoc(doc.ref);
            }

            // Remove old ExerciseInfoOnRoutine
            for (const routineID of routineIDsList) {
                const q = query(collection(db, 'exerciseinfoonroutine'), where("routineID", "==", routineID));
                const querySnapshot = await getDocs(q);

                for (const doc of querySnapshot.docs) {
                    await deleteDoc(doc.ref);
                }
            }

            // Add new workoutroutines
            return await this.createWorkoutRoutine(routines, fitnessPlanID);

            
        }catch(error){
            throw new Error('update wr ' + error);
        }
    }

    async getWorkoutRoutines(fitnessPlanID){
        try{
            const q = query(collection(db, 'workoutroutine'), where("fitnessPlanID", "==", fitnessPlanID), orderBy("dayNumber"));
            const querySnapshot = await getDocs(q);

            const routines = [];
            for (const doc of querySnapshot.docs) {
                const data = doc.data();

                const routine = new WorkoutRoutine();
                routine.routineID = doc.id;
                routine.fitnessPlanID = data.fitnessPlanID;
                routine.dayNumber = data.dayNumber;
                routine.estCaloriesBurned = data.estCaloriesBurned;
                routine.isRestDay = data.isRestDay;

                routines.push(routine);
            }

            return routines;
        }catch(error){
            throw new Error(error);
        }
    }

    async getExercisesOnRoutine(routineID){
        try{
            
            const q = query(collection(db, 'exerciseinfoonroutine'), where("routineID", "==", routineID), orderBy("orderNo"));
            const querySnapshot = await getDocs(q);


            for (const doc2 of querySnapshot.docs) {
                const data = doc2.data();
                

                const exercise = await new Exercise().getExercise(data.exerciseID);

                this.addExerciseToList(data.duration, exercise, data.sets);
            }
            
        }catch(error){
            throw new Error(error);
        }
    }

    async deleteWorkoutRoutine(){
        try{

            // Remove all exercises on the routine
            const q = query(collection(db, 'exerciseinfoonroutine'), where("routineID", "==", this.routineID));
            const querySnapshot = await getDocs(q);

            for (const doc of querySnapshot.docs) {
                await deleteDoc(doc.ref);
            }

            // Remove the routine
            await deleteDoc(doc(db, 'workoutroutine', this.routineID));
            
        }catch(error){
            throw new Error(error);
        }
    }
    
}

export default WorkoutRoutine;