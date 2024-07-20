import axios from "axios";
import {
    EXERCISE_NINJA_API_KEY,
    EXERCISE_NINJA_HOST,
    FIREBASE_API_KEY as YOUTUBE_API_KEY
} from "@env";



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
                
                // const query = `exercise how to do ${newExercise.exerciseName}`;
                // const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=1&order=relevance&videoDuration=short&videoEmbeddable=true&regionCode=US&key=${YOUTUBE_API_KEY}`;
                // const yt_res = await axios.get(url);
                // const yt_data = yt_res.data;
                // newExercise.youtubeLink = `${yt_data.items[0].id.videoId}`;
                newExercise.youtubeLink = "";



                exerciseList.push(newExercise);
            }
            
            return exerciseList;
        }catch(error){
            throw new Error(error);
        }
    }

    


    

}

export default Exercise;