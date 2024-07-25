import User from '../model/User.js';

class UpdateExerciseSettingsPresenter {
    constructor(view) {
        this.view = view;
        this.user = new User();
    }

    async updateExerciseSettings(userEmail, restInterval, stepTarget, calorieTarget) {
        try {
            onlyNumber = /^\d+$/;

            if (stepTarget .trim() === '' || stepTarget .trim() === '') {
                throw new Error('Please complete all fields!');
            }
            else if (restInterval === 0 || restInterval < 20){
                throw new Error('Rest Interval must be more than 20 seconds! ');
              }
            else if (!onlyNumber.test(restInterval) || !onlyNumber.test(stepTarget) || !onlyNumber.test(calorieTarget)) {
                // Check if weight is a number or decimal
                throw new Error('Please only enter numbers!');
            }
            else {
                await this.user.updateExerciseSettings(userEmail, parseInt(restInterval), parseInt(stepTarget), parseInt(calorieTarget));
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default UpdateExerciseSettingsPresenter;