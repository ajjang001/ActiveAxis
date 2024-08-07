import CoachingFeedback from '../model/CoachingFeedback.js';

class UpdateCoachFeedbackPresenter {
    constructor() {
        this.coachFeedback = new CoachingFeedback();
    }
    async UserUpdateCoachFeedback(feedbackID, feedbackData) {

        if (feedbackData.feedbackText.trim() === '') {
            throw new Error('Please enter feedback comments!');
        }
        else if (feedbackData.rating === 0) {
            throw new Error('Please select a star rating!');
        }
        else {
            try {
                await this.coachFeedback.updateUserCoachFeedback(feedbackID, feedbackData);
            }
            catch (error) {
                throw new Error(error);
            }
        }
    }
}
export default UpdateCoachFeedbackPresenter;