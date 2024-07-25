import Exercise from '../model/Exercise.js';
import FitnessPlan from '../model/FitnessPlan.js';
import WorkoutRoutine from '../model/WorkoutRoutine.js';

class EditFitnessPlanPresenter{
    constructor(view){
        this.view = view;
        this.model = null;

    }

    deepCopy(arr){
        const returnedArr = arr.map(item=>item.clone());
        return returnedArr;
    }

    async getGoalID(goalName){
        try{
            this.model = new FitnessPlan();
            const goalID = await this.model.getGoalID(goalName);
            
            return goalID;
        }catch(e){
            throw new Error(e);
        }
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
}

export default EditFitnessPlanPresenter;