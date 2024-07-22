import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {auth, db, storage} from '../firebase/firebaseConfig';
import WorkoutRoutine from "./WorkoutRoutine";
import Exercise from "./Exercise";

class FitnessPlan{
    _fitnessPlanID;
    _coachID;
    _fitnessPlanName;
    _fitnessPlanDescription;
    _planGoal;
    _fitnessPlanPicture;
    _routinesList;
    _lastUpdated;
    

    constructor(){}

    get fitnessPlanID(){ return this._fitnessPlanID; }
    get coachID(){ return this._coachID; }
    get fitnessPlanName(){ return this._fitnessPlanName; }
    get fitnessPlanDescription(){ return this._fitnessPlanDescription; }
    get planGoal(){ return this._planGoal; }
    get fitnessPlanPicture(){ return this._fitnessPlanPicture; }
    get routinesList(){ return this._routinesList; }
    get lastUpdated(){ return this._lastUpdated; }
    
    
    set fitnessPlanID(fitnessPlanID){ this._fitnessPlanID = fitnessPlanID; }
    set coachID(coachID){ this._coachID = coachID; }
    set fitnessPlanName(fitnessPlanName){ this._fitnessPlanName = fitnessPlanName; }
    set fitnessPlanDescription(fitnessPlanDescription){ this._fitnessPlanDescription = fitnessPlanDescription; }
    set planGoal(planGoal){ this._planGoal = planGoal; }
    set fitnessPlanPicture(fitnessPlanPicture){ this._fitnessPlanPicture = fitnessPlanPicture; }
    set routinesList(routinesList){ this._routinesList = routinesList; }
    set lastUpdated(lastUpdated){ this._lastUpdated = lastUpdated; }


    async getGoals (){
        try{
            const querySnapshot = await getDocs(collection(db, 'fitnessgoal'));
            const goals = [];
            querySnapshot.forEach(doc => {
                goals.push({id: doc.data().goalID, name: doc.data().goalName});
            });

            return goals;
        }catch(e){
            throw new Error(e);
        }
    }

    async getFitnessLevel (){
        try{
            const querySnapshot = await getDocs(collection(db, 'fitnesslevel'));
            const level = [];
            querySnapshot.forEach(doc => {
                level.push({id: doc.data().levelID, name: doc.data().levelName});
            });

            return level;
        }catch(e){
            throw new Error(e);
        }
    }

    async createFitnessPlan(coach, photo, goalType, details, name, medicalCheck, routines){
        try{

            // Add the fitness plan to the database (FitnessPlan)
            const docRef = await addDoc(collection(db, 'fitnessplan'), {
                coachID: coach.accountID,
                fitnessPlanName: name,
                fitnessPlanDescription: details,
                planGoal: goalType,
                isMedicalCheck: medicalCheck,
                lastUpdated: Timestamp.now()
            });

            const fitnessPlanID = docRef.id;


            // Convert URI to Blob
            const uriToBlob = (uri) => {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhr.onload = function () {
                        // return the blob
                        resolve(xhr.response)
                    }
                    xhr.onerror = function () {
                        reject(new Error('uriToBlob failed'))
                    }
                    xhr.responseType = 'blob'
                    xhr.open('GET', uri, true)

                    xhr.send(null)
                })
            };

            // Upload file to Firebase Storage
            const uploadFile = async (file, folderPath) => {
                if (!file || !file.uri) throw new Error('File URI is invalid');

                const storageRef = ref(storage, folderPath + file.name);
                const blobFile = await uriToBlob(file.uri);
                try {
                    await uploadBytes(storageRef, blobFile);
                    return `${folderPath}${file.name}`;
                } catch (e) {
                    throw new Error("Error occurred: " + e.message + "\nPlease try again or contact customer support.");

                }

            };

            // Folder path
            const folderPath = `coach/${coach.email.split('@')[0]}/fitnessplan/${fitnessPlanID}_`;

            // Upload files to Firebase Storage
            const photoPath = await uploadFile(photo, folderPath);

            // Add the photo path to the database
            await updateDoc(doc(db, 'fitnessplan', fitnessPlanID), {
                fitnessPlanPicture: photoPath
            });





            
            // Add each day to the database (WorkoutRoutine)
            const routineIDsList = await new WorkoutRoutine().createWorkoutRoutine(routines, fitnessPlanID);
            
            // Add to Exercise database (Exercise)
            const exerciseIDList = await new Exercise().createExercise(routines);

            
            // Add join table for many-to-many relationship
            // between WorkoutRoutine and Exercise  (ExerciseInfoOnRoutine)
            for (let i = 0; i < routineIDsList.length; i++) {
                for (let j = 0; j < exerciseIDList[i].length; j++) {
                    await addDoc(collection(db, 'exerciseinfoonroutine'), {
                        exerciseID: exerciseIDList[i][j],
                        routineID: routineIDsList[i],
                        orderNo: j + 1,
                        duration: routines[i].exercisesList[j].duration,
                        sets: routines[i].exercisesList[j].sets
                    });
                }
            }

 
        }catch(e){
            throw new Error(e);
        }
    }


    
}

export default FitnessPlan;