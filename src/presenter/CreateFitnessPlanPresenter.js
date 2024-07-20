import Exercise from '../model/Exercise.js';
import WorkoutRoutine from '../model/WorkoutRoutine.js';

class CreateFitnessPlanPresenter{
    constructor (view){
        this.view = view;
        this.model = null;
    }

    deepCopy(arr){
        const returnedArr = arr.map(item=>item.clone());
        return returnedArr;
    }

    addRoutine(){
        try{
            const routinesSize = this.view.routines.length;
            
            this.model = new WorkoutRoutine();
            this.model.dayNumber = routinesSize + 1;

            this.view.routines.push(this.model);

        }catch(error){
            throw new Error(error);
        }
    }

    addRestDay(){
        try{
            const routinesSize = this.view.routines.length;

            this.model = new WorkoutRoutine();
            this.model.dayNumber = routinesSize + 1;
            this.model.isRestDay = true;

            this.view.routines.push(this.model);

        }catch(error){
            throw new Error(error);
        }
    }
    
    swapRoutine(index){
        try{
            const routineArrTemp = this.view.routines.map(routine =>({...routine}));

            if(routineArrTemp[index]._isRestDay){
                routineArrTemp[index]._isRestDay = false;   
            }else{
                routineArrTemp[index]._isRestDay = true;
            }
            routineArrTemp[index]._exercisesList = [];


            const returnedArr = [];

            routineArrTemp.forEach(routine =>{
                this.model = new WorkoutRoutine();
                this.model.routineID = routine._routineID;
                this.model.fitnessPlanID = routine._fitnessPlanID;
                this.model.dayNumber = routine._dayNumber;
                this.model.exercisesList = routine._exercisesList;
                this.model.isRestDay = routine._isRestDay;

                returnedArr.push(this.model);
            });


            this.view.updateRoutines(returnedArr);
            



        }
        catch(error){
            throw new Error(error);
        }
    }

    removeRoutine(index){
        try{
            const routineArrTemp = this.view.routines.map(routine =>({...routine}));
            let deletedDay = routineArrTemp[index]._dayNumber;
            routineArrTemp.splice(index, 1);


            // Reorder the day number
            for(let i = index; i < routineArrTemp.length; i++){
                routineArrTemp[i]._dayNumber = deletedDay;
                deletedDay++;
            }

            const returnedArr = [];

            routineArrTemp.forEach(routine =>{
                this.model = new WorkoutRoutine();
                this.model.routineID = routine._routineID;
                this.model.fitnessPlanID = routine._fitnessPlanID;
                this.model.dayNumber = routine._dayNumber;
                this.model.exercisesList = routine._exercisesList;
                this.model.isRestDay = routine._isRestDay;

                returnedArr.push(this.model);
            });


            this.view.updateRoutines(returnedArr);

            
            

        }catch(error){
            throw new Error(error);
        }
    }


    async searchExercises (name, type, muscle){
        try{
            this.model = new Exercise();
            const exerciseList = await this.model.getExerciseList(name, type, muscle);

            this.view.updateExerciseList(exerciseList);


        }catch(error){
            throw new Error(error);
        }
    }

    addExerciseToList(exercise){
        try{
            this.model = this.view.routines;
            const routineIndex = this.view.routineIndex;

            this.model[routineIndex].addExerciseToList(exercise);
        }catch(error){
            throw new Error(error);
        }
    }

    async setVideo(){
        try{
            this.model = this.view.exercise;
            await this.model.setVideoLink();
        }catch(error){
            throw new Error(error);
        }

    }

    
}

export default CreateFitnessPlanPresenter;