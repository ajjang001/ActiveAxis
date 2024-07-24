import axios from "axios";
import {
    EXERCISE_NINJA_API_KEY,
    EXERCISE_NINJA_HOST,
    FIREBASE_API_KEY as YOUTUBE_API_KEY
} from "@env";
import { getDoc, doc, getDocs, query, collection, where, setDoc, Timestamp, updateDoc, orderBy, startAt, endAt, deleteDoc, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {auth, db, storage} from '../firebase/firebaseConfig';




class Exercise{
    _exerciseID;
    _exerciseName;
    _exerciseType;
    _muscle;
    _equipment;
    _difficulty;
    _instructions;
    _youtubeLink;

    get exerciseID(){ return this._exerciseID; }
    get exerciseName(){ return this._exerciseName; }
    get exerciseType(){ return this._exerciseType; }
    get muscle(){ return this._muscle; }
    get equipment(){ return this._equipment; }
    get difficulty(){ return this._difficulty; }
    get instructions(){ return this._instructions; }
    get youtubeLink(){ return this._youtubeLink; }

    set exerciseID(exerciseID){ this._exerciseID = exerciseID; }
    set exerciseName(exerciseName){ this._exerciseName = exerciseName; }
    set exerciseType(exerciseType){ this._exerciseType = exerciseType; }
    set muscle(muscle){ this._muscle = muscle; }
    set equipment(equipment){ this._equipment = equipment; }
    set difficulty(difficulty){ this._difficulty = difficulty; }
    set instructions(instructions){ this._instructions = instructions; }
    set youtubeLink(youtubeLink){ this._youtubeLink = youtubeLink; }

    constructor(){
        this._exerciseID = "";
        this._exerciseName = "";
        this._exerciseType = "";
        this._muscle = "";
        this._equipment = "";
        this._difficulty = "";
        this._instructions = "";
        this._youtubeLink = "";
    }

    clone(){
        const clone = new Exercise();
        clone.exerciseID = this.exerciseID;
        clone.exerciseName = this.exerciseName;
        clone.exerciseType = this.exerciseType;
        clone.muscle = this.muscle;
        clone.equipment = this.equipment;
        clone.difficulty = this.difficulty;
        clone.instructions = this.instructions;
        clone.youtubeLink = this.youtubeLink;
        return clone;
    }

    async getExerciseList(name, type, muscle){
        try{
            const exerciseList = [];

            const options = {
                method: 'GET',
                url: `https://${EXERCISE_NINJA_HOST}/v1/exercises`,
                params:{
                    name: name,
                    type: type,
                    muscle: muscle,
                },
                headers:{
                    'x-rapidapi-key' : EXERCISE_NINJA_API_KEY,
                    'x-rapidapi-host' : EXERCISE_NINJA_HOST
                }
            };
            


            const response = await axios.request(options);

            

            for ( const exercise of response.data){
                const newExercise = new Exercise();

                newExercise.exerciseID = "";
                newExercise.exerciseName = exercise.name;
                newExercise.exerciseType = exercise.type;
                newExercise.muscle = exercise.muscle;
                newExercise.equipment = exercise.equipment;
                newExercise.difficulty = exercise.difficulty;
                newExercise.instructions = exercise.instructions;
                newExercise.youtubeLink = "";



                exerciseList.push(newExercise);
            }
            
            return exerciseList;
        }catch(error){
            throw new Error(error);
        }
    }

    async createExercise(routines){
        try{
            const exerciseIDList = [];
            for (const routine of routines) {
                // Only add exercises that are not rest day
                if (!routine.isRestDay) {
                    const exerciseIDEachRoutine = [];

                    for (const exercise of routine.exercisesList) {
                        // Check if the exercises exists in database
                        
                        const q = query(collection(db, "exercise"), where("exerciseName", "==", exercise.exercise.exerciseName));
                        const querySnapshot = await getDocs(q);

                        if (querySnapshot.empty) {
                            // Add the exercise to the database
                            const docRef = await addDoc(collection(db, 'exercise'), {
                                exerciseName: exercise.exercise.exerciseName,
                                exerciseType: exercise.exercise.exerciseType,
                                muscle: exercise.exercise.muscle,
                                equipment: exercise.exercise.equipment,
                                difficulty: exercise.exercise.difficulty,
                                instructions: exercise.exercise.instructions,
                                youtubeLink: exercise.exercise.youtubeLink
                            });

                            exerciseIDEachRoutine.push(docRef.id);

                        } else {
                            // expected 1 document
                            exerciseIDEachRoutine.push(querySnapshot.docs[0].id);
                        }
                    }

                    // Add the exerciseIDEachRoutine to the main list
                    exerciseIDList.push(exerciseIDEachRoutine);
                } else {
                    exerciseIDList.push([]);
                }
            }

            return exerciseIDList;

        }catch(error){
            throw new Error(error);
        }

    }

    async setVideoLink(){
        try{
            // Check if the exercise exists in the database

            const q = query(collection(db, "exercise"), where("exerciseName", "==", this.exerciseName));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty){
                const yt_query = `exercise how to do ${this.exerciseName}`;
                const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(yt_query)}&maxResults=1&order=relevance&videoDuration=short&videoEmbeddable=true&regionCode=US&key=${YOUTUBE_API_KEY}`;
                const yt_res = await axios.get(url);
                const yt_data = yt_res.data;
                this.youtubeLink = `${yt_data.items[0].id.videoId}`;
                console.log('Fetched ID :' + this.youtubeLink);
            }else{
                console.log('Data exists ' + querySnapshot.docs[0].data().youtubeLink);
                this.youtubeLink = querySnapshot.docs[0].data().youtubeLink;
            }

            
                
        }catch(error){
            throw new Error(error);
        }
    }


    async getExercise(exerciseID){
        try{
            const docRef = doc(db, "exercise", exerciseID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()){
                const data = docSnap.data();
                const exercise = new Exercise();

                exercise.exerciseID = exerciseID;
                exercise.exerciseName = data.exerciseName;
                exercise.exerciseType = data.exerciseType;
                exercise.muscle = data.muscle;
                exercise.equipment = data.equipment;
                exercise.difficulty = data.difficulty;
                exercise.instructions = data.instructions;
                exercise.youtubeLink = data.youtubeLink;
                
                
                return exercise;
            }else{
                throw new Error("No such document");
            }
        }catch(error){
            throw new Error(error);
        }
    }

    


    

}

export default Exercise;