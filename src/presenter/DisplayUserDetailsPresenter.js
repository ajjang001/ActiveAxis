import User from '../model/User';

class DisplayUserDetailsPresenter {
    constructor(view, db) {
        this.view = view;
        this.db = db;
    }

    async loadUserDetails(userID) {
        try {
            const user = new User();
            const details = await user.getDetails(userID);
            console.log("Loaded user details:", details); // Debugging line
            this.view.displayUserDetails(details);
        } catch (error) {
            console.error("Error loading user details:", error.message); // Detailed error message
            console.error(error.stack); // Full stack trace for more context
            throw error;
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

export default DisplayUserDetailsPresenter;
