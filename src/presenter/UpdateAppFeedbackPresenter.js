import AppFeedback from '../model/AppFeedback';

class UpdateAppFeedbackPresenter {
    constructor(view) {
        this.view = view;
        this.model = new AppFeedback();
    }

    async fetchFeedbackById(feedbackId) {
      try {
          const feedback = await AppFeedback.fetchFeedbackById(feedbackId);
          this.view.displayFeedback(feedback);
      } catch (error) {
          this.view.showError(error.message);
      }
  }

    async fetchFeedbacks() {
        try {
            const feedbackList = await this.model.fetchFeedbacks();
            this.view.displayFeedbacks(feedbackList);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    async updateFeedback(feedbackId, newFeedback) {
        try {
            await this.model.updateFeedback(feedbackId, newFeedback);
            this.view.showSuccess("Feedback updated successfully");
        } catch (error) {
            this.view.showError(error.message);
        }
    }
}

export default UpdateAppFeedbackPresenter;
