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



    async searchExercises (name, type, muscle){
        try{
            this.model = new Exercise();
            const exerciseList = await this.model.getExerciseList(name, type, muscle);

            this.view.updateExerciseList(exerciseList);


        }catch(error){
            throw new Error(error);
        }
    }

    addExerciseToList(alarmString, exercise, repetition){
        try{
            this.model = this.view.routines;
            const routineIndex = this.view.routineIndex;

            if(alarmString === '' || alarmString === undefined){
                throw new Error('Please enter exercise duration');
            }
            if (alarmString === '00:00'){
                throw new Error('Duration cannot be 00:00');
            }
            if (repetition === '' || repetition === undefined){
                throw new Error('Please enter number of repetitions');
            }

            if (repetition <= 0){
                throw new Error('Number of repetitions must be greater than 0');
            }
            if(repetition > 10){
                throw new Error('Number of repetitions must be less than or equal 10');
            }

            this.model[routineIndex].addExerciseToList(alarmString, exercise, repetition);
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

    async createFitnessPlan (coach, photo, goalType, details, name, medicalCheck, routines){
        
        try{
            if(photo === '' || photo === null){
                throw new Error('Please upload a photo');
            }else if (goalType === 0 || goalType === undefined){
                throw new Error('Please select a goal type');
            }else if (name === '' || name === undefined){
                throw new Error('Please enter a fitness plan name');
            }else if (details === '' || details === undefined){
                throw new Error('Please enter details');
            }else if (routines.length === 0){
                throw new Error('Please add at least one routine');
            }else{
                let isAllRestDay = true;
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

                this.model = new FitnessPlan();
                await this.model.createFitnessPlan(coach, photo, goalType, details, name, medicalCheck, routines);
            }
        }catch(error){
            throw new Error(error);
        }
    }

    
}

export default CreateFitnessPlanPresenter;