import Coach from '../model/Coach.js';

class DisplayAccountDetailsCoachPresenter {
    constructor(view) {
        this.view = view;
        this.coach = new Coach();
    }

    async viewAccountDetails(userEmail) {
        try {
            const coachDetails = await this.coach.getInfo(userEmail);
            this.view.displayAccountDetails(coachDetails);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default DisplayAccountDetailsCoachPresenter;
