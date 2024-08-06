import CoachingHistory from '../model/CoachingHistory.js';

class DisplayCoachHistoryPresenter {
    constructor() {
        this.history = new CoachingHistory();
    }

    async displayCoachingHistory(userID, setCoaches) {
        try {
            const coachHistory = await this.history.getUserCoachHistory(userID);
            setCoaches(coachHistory);
        } catch (error) {
            throw new Error(error);
        }
    }
}
export default DisplayCoachHistoryPresenter;