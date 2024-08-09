import Friends from '../model/Friends';
import User from '../model/User';

class DisplayFriendDetailsPresenter {
  constructor(view, db) {
      this.view = view;
      this.model = new Friends(db);
  }

  async loadFriendDetails(friend) {
      try {
        console.log("Details for friend accountID:", friend.accountID);
          const friendDetails = await this.model.getFriendDetails(friend.accountID);
          this.view.displayFriendDetails(friendDetails);
      } catch (error) {
          console.error("Failed to load friend details:", error);
      }
  }

  async loadGoalLevelName(fitnessGoal, fitnessLevel) {
    try {
        const user = new User();

        // Get the fitness goal name
        const goalName = await user.getFitnessGoalName(fitnessGoal);

        // Get the fitness level name
        const levelName = await user.getFitnessLevelName(fitnessLevel);

        // Assign the names to the user object or handle them as needed
        user.fitnessGoalName = goalName;
        user.fitnessLevelName = levelName;

        return user; // Return the user object or use it as needed
    } catch (error) {
        console.error("Error loading goal and level name:", error.message); // Detailed error message
        throw error;
    }
}
}

export default DisplayFriendDetailsPresenter;
