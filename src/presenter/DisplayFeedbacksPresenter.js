import AppFeedback from "../model/AppFeedback";

class DisplayFeedbacksPresenter {
  constructor(view) {
    this.view = view;
    this.appFeedback = new AppFeedback();
  }

  async loadFeedbacks() {
    try {
      const feedbacks = await this.appFeedback.fetchFeedbacks();
      this.view.displayFeedbacks(feedbacks);
    } catch (error) {
      this.view.displayError(error.message);
    }
  }
}

export default DisplayFeedbacksPresenter;
