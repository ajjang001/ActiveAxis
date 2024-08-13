import FitnessGoals from "../model/FitnessGoals";

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
}

export default DisplayFitnessPlanDetailsPresenter;