import User from '../model/User';

class DisplayUserDetailsPresenter {
    constructor(view, db) {
        this.view = view;
        this.db = db;
    }

    async loadUserDetails(userId) {
        try {
            const user = new User();
            const details = await user.getDetails(userId);
            console.log("Loaded user details:", details); // Debugging line
            this.view.displayUserDetails(details);
        } catch (error) {
            console.error("Error loading user details:", error.message); // Detailed error message
            console.error(error.stack); // Full stack trace for more context
            throw error;
        }
    }
}

export default DisplayUserDetailsPresenter;
