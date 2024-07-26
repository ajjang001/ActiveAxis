import Exercise from '../model/Exercise.js';
import FitnessPlan from '../model/FitnessPlan.js';
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

    async getGoals(){
        try{
            this.model = new FitnessPlan();
            const goals = await this.model.getGoals(); 
            this.view.updateGoals(goals);
        }catch(error){
            throw new Error(error);
        }
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

    removeExercise(index){
        try{
            // check if exercise index is last index
            if(index === this.view.routine.exercisesList.length - 1){
                
                this.view.routine.exercisesList.pop();
                return;
            }else{
                this.view.routine.exercisesList.splice(index, 1);
            }
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

    addExerciseToList(alarmString, exercise, sets){
        try{
            this.model = this.view.routines;
            const routineIndex = this.view.routineIndex;

            if(alarmString === '' || alarmString === undefined){
                throw new Error('Please enter exercise duration');
            }
            if (alarmString === '00:00'){
                throw new Error('Duration cannot be 00:00');
            }
            if (sets === '' || sets === undefined){
                throw new Error('Please enter number of sets');
            }

            if (sets <= 0){
                throw new Error('Number of sets must be greater than 0');
            }
            if(sets > 10){
                throw new Error('Number of sets must be less than or equal 10');
            }

            this.model[routineIndex].addExerciseToList(alarmString, exercise, sets);
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

    async calculateCalories(){
        try{
            const routines = this.view.routines;

            for (const routine of routines){

                if(!routine.isRestDay){
                    this.model = routine;
                    await this.model.calculateCaloriesBurned();
                }
                
                
            }
        }catch(error){
            throw new Error(error);
        }
    }

    validateRoutines(){
        try{
            let isAllRestDay = true;
            const routines = this.view.routines;

            routines.forEach(routine =>{
                if(routine.exercisesList.length === 0 && !routine.isRestDay){
                    throw new Error('Please add at least one exercise on Day ' + routine.dayNumber);
                }
                if (!routine.isRestDay){
                    isAllRestDay = false;
                }
            });

            if(isAllRestDay){
                throw new Error('Please add at least one Exercise Day');
            }
        }catch(e){
            throw new Error(e);
        }
    }

    async createFitnessPlan (coach, photo, goalType, description, name, medicalCheck, routines){
        
        try{
            if(photo === '' || photo === null){
                throw new Error('Please upload a photo');
            }else if (goalType === 0 || goalType === undefined){
                throw new Error('Please select a goal type');
            }else if (name === '' || name === undefined){
                throw new Error('Please enter a fitness plan name');
            }else if (description === '' || description === undefined){
                throw new Error('Please enter description');
            }else if (routines.length === 0){
                throw new Error('Please add at least one routine');
            }else{

                this.model = new FitnessPlan();
                await this.model.createFitnessPlan(coach, photo, goalType, description, name, medicalCheck, routines);
            }
        }catch(error){
            throw new Error(error);
        }
    }

    
}

export default CreateFitnessPlanPresenter;