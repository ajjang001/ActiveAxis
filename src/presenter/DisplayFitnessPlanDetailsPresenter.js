import AllocatePlan from "../model/AllocatePlan";
import FitnessGoals from "../model/FitnessGoals";
import WorkoutRoutine from "../model/WorkoutRoutine";

class DisplayFitnessPlanDetailsPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async getFitnessGoalByID(goalID){
        try{
            this.model = new FitnessGoals();
            this.view.updateFitnessGoal(await this.model.getFitnessGoalByID(goalID));
        }catch(error){
            throw new Error(error);
        }
    }

    async updateAllocationPlan(allocationID, repetition, newEndDate){
        try{
            this.model = new AllocatePlan();
            await this.model.updateAllocationPlan(allocationID, repetition, newEndDate);   
        }catch(error){
            throw new Error(error);
        }
    }

    async loadRoutines(repetition, isNewEndDate){
        try{
            this.model = this.view.fitnessPlan;
            await this.model.loadRoutines();

            if(isNewEndDate){
                // duplicate the routines based on the repetition (excluding the first repetition)
                const routines = [...this.model.routinesList];
                const l = routines.length;
                
                for(let i = 1; i < repetition; i++){
                    for(let j = 0; j < l; j++){
                        const routine = routines[j];
                        const exercises = routine.exercisesList;

                        const newRoutine = new WorkoutRoutine();
                        newRoutine.dayNumber = routine.dayNumber + (i * routines.length);
                        newRoutine.estCaloriesBurned = routine.estCaloriesBurned;
                        newRoutine.exercisesList = exercises;
                        newRoutine.fitnessPlanID = routine.fitnessPlanID;
                        newRoutine.isRestDay = routine.isRestDay;
                        newRoutine.routineID = routine.routineID;


                        this.model.routinesList.push(newRoutine);
                    }
                }
            }
        }catch(e){
            throw new Error(e);
        }

    }
}

export default DisplayFitnessPlanDetailsPresenter;