import FitnessGoals from '../model/FitnessGoals';

class FitnessGoalsPresenter {
    constructor(view) {
        this.view = view;
        this.fitnessGoalsModel = new FitnessGoals();
    }

    async loadFitnessGoals() {
        try {
            const fitnessGoals = await this.fitnessGoalsModel.getFitnessGoals();
            this.view.updateFitnessGoals(fitnessGoals);
        } catch (error) {
            throw new Error(error);
        }
    }

    async addFitnessGoal(newGoal, fitnessGoals) {
        try {
            const newGoalID = await this.fitnessGoalsModel.addFitnessGoal(newGoal);
            const newFitnessGoal = new FitnessGoals();
            newFitnessGoal.goalID = newGoalID;
            newFitnessGoal.goalName = newGoal;
            fitnessGoals.push(newFitnessGoal);
            this.view.updateFitnessGoals(fitnessGoals);
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateFitnessGoal(index, updatedGoalName, fitnessGoals) {
        try {
            const goal = fitnessGoals[index];
            await this.fitnessGoalsModel.updateFitnessGoal(goal.goalID, updatedGoalName);
            this.fitnessGoals[index].goalName = updatedGoalName;
            this.view.updateFitnessGoals(this.fitnessGoals);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default FitnessGoalsPresenter;


  
  
  