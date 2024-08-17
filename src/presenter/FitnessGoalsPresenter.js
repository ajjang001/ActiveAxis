import FitnessGoals from '../model/FitnessGoals';

class FitnessGoalsPresenter {
    constructor(view) {
        this.view = view;
        this.fitnessGoalsModel = new FitnessGoals();
        this.fitnessGoals = [];
    }

    async loadFitnessGoals() {
        try {
            this.fitnessGoals = await this.fitnessGoalsModel.getFitnessGoals();
            console.log('Loaded fitness goals:', this.fitnessGoals);  // Debug log
            this.view.updateFitnessGoals(this.fitnessGoals);
        } catch (error) {
            console.error('Failed to load fitness goals:', error);
        }
    }

    async addFitnessGoal(newGoal, fitnessGoals) {
        try {
            const newGoalID = await this.fitnessGoalsModel.addFitnessGoal(newGoal);
            const newFitnessGoal = new FitnessGoals();
            newFitnessGoal.goalID = newGoalID;
            newFitnessGoal.goalName = newGoal;
            fitnessGoals.push(newFitnessGoal);
            this.view.updateFitnessGoals(this.fitnessGoals);
        } catch (error) {
            console.error('Failed to add fitness goal:', error);
        }
    }

    async updateFitnessGoal(index, updatedGoalName, fitnessGoals) {
        try {
            const goal = fitnessGoals[index];
            await this.fitnessGoalsModel.updateFitnessGoal(goal.goalID, updatedGoalName);
            this.fitnessGoals[index].goalName = updatedGoalName;
            this.view.updateFitnessGoals(fitnessGoals);
        } catch (error) {
            console.error('Failed to update fitness goal:', error);
        }
    }
}

export default FitnessGoalsPresenter;


  
  
  