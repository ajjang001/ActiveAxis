class FitnessGoalsPresenter {
    constructor(view) {
      this.view = view;
      this.fitnessGoals = ['Goal 1', 'Goal 2', 'Goal 3'];
    }
  
    loadFitnessGoals() {
      this.view.updateFitnessGoals(this.fitnessGoals);
    }
  
    addFitnessGoal(newGoal) {
      this.fitnessGoals.push(newGoal);
      this.view.updateFitnessGoals(this.fitnessGoals);
    }
  
    updateFitnessGoal(index, updatedGoal) {
      this.fitnessGoals[index] = updatedGoal;
      this.view.updateFitnessGoals(this.fitnessGoals);
    }
  }
  
  export default FitnessGoalsPresenter;
  
  
  
  