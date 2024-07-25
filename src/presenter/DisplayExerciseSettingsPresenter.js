import User from '../model/User.js';

class DisplayExerciseSettingsPresenter {
    constructor(view) {
        this.view = view;
        this.user = new User();
    }

    async viewAccountDetails(userEmail, userType) {
        try {
            console.log("Fetching account details for:", userEmail, "as", userType);
            let accountDetails;
            if (userType === 'user') {
                accountDetails = await this.user.getCoacheeDetails(userEmail);
            } else {
                throw new Error("Invalid user type");
            }
            this.view.displayAccountDetails(accountDetails);
        } catch (error) {
            console.error("Error fetching account details:", error.message);
            throw new Error(error.message);
        }
    }
}

export default DisplayExerciseSettingsPresenter;
