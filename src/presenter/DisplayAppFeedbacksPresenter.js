import Feedbacks from '../model/Feedbacks';

class DisplayAppFeedbacksPresenter {
  constructor(view) {
    this.view = view;
    this.fiveStarFeedbacks = [];
  }

  async loadFeedbacks() {
    try {
      const feedbacks = await Feedbacks.fetchFeedbacks();
      this.fiveStarFeedbacks = feedbacks.filter(feedback => feedback.rating === 5);
      this.displayRandomFeedback();
    } catch (error) {
      this.view.displayError(error.message);
    }
  }

  displayRandomFeedback() {
    if (this.fiveStarFeedbacks.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.fiveStarFeedbacks.length);
      this.view.displayFeedback(this.fiveStarFeedbacks[randomIndex]);
    } else {
      this.view.displayError("No feedbacks with 5-star ratings found.");
    }
  }
}

export default DisplayAppFeedbacksPresenter;
