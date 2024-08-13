import CoachingHistory from '../model/CoachingHistory.js';

class HireCoachPresenter {
    constructor(view) {
        this.view = view;
        this.history = new CoachingHistory();
    }

    async displayCoaches(setCoaches) {
        try {
            const coaches = await this.history.getCoaches();
            setCoaches(coaches);
        } catch (error) {
            throw new Error(error);
        }
    }

    async userHireCoach(userID, selectedCoach) {
        try {
            await this.history.hireCoach(userID, selectedCoach);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getHireStatus(userID) {
        try {
            const isHired = await this.history.getHired(userID);
            return isHired;
        } catch (error) {
            throw new Error(error);
        }
    }

    async userExtendHireCoach(endDate, sessionID) {
        try {
            await this.history.extendHireCoach(endDate, sessionID);
        } catch (error) {
            throw new Error(error);
        }
    }
}
export default HireCoachPresenter;