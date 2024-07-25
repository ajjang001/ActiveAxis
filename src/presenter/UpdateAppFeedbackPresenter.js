import AppFeedback from '../model/AppFeedback';

class UpdateAppFeedbackPresenter {
    constructor(view) {
        this.view = view;
        this.model = new AppFeedback();
    }

    async updateFeedback(feedbackText, rating) {
        try {
            this.model = this.view.feedback;
            this.model.updateFeedback(feedbackText, rating);

        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default UpdateAppFeedbackPresenter;
