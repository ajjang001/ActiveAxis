import CoachingFeedback from '../model/CoachingFeedback.js';

class SendFeedbackToCoachPresenter {
    constructor() {
        this.coachFeedback = new CoachingFeedback();
    }

    async displayUserCoachFeedback(userID, coachID, setFeedback) {
        try {
            const coachFeedback = await this.coachFeedback.getUserCoachFeedback(userID, coachID);
            setFeedback(coachFeedback);
        } catch (error) {
            throw new Error(error);
        }
    }

    async UserSubmitCoachFeedback(feedbackData) {

        if (feedbackData.feedbackText.trim() === '') {
            throw new Error('Please enter feedback comments!');
        }
        else if (feedbackData.rating === 0) {
            throw new Error('Please select a star rating!');
        }
        else {
            try {
                await this.coachFeedback.submitUserCoachFeedback(feedbackData);
            }
            catch (error) {
                throw new Error(error);
            }
        }
    }
}
export default SendFeedbackToCoachPresenter;