import AppFeedback from "../model/AppFeedback";

class DisplayFeedbacksPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadFeedbacks() {
    try {
      const feedbacks = await AppFeedback.fetchFeedbacks();
      this.view.displayFeedbacks(feedbacks);
    } catch (error) {
      this.view.displayError(error.message);
    }
  }
}

export default DisplayFeedbacksPresenter;
