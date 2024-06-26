import AppFeedback from '../model/AppFeedback';

class DisplayAppFeedbacksPresenter {
  constructor(view) {
    this.view = view;
    this.fiveStarFeedbacks = [];
  }

  async loadFeedbacks() {
    try {
      const feedbacks = await AppFeedback.fetchFeedbacks();
      this.fiveStarFeedbacks = feedbacks.filter((feedback) => feedback.rating === 5);
      this.displayRandomFeedback();
    } catch (error) {
      this.view.displayError(error.message);
    }
  }

  displayRandomFeedback() {
    if (this.fiveStarFeedbacks.length > 0) {
      const selected = [];
      for (let c = 1 ; c <= 5 ; c++){
        if (this.fiveStarFeedbacks.length === 0) break;

        const randomIndex = Math.floor(Math.random() * this.fiveStarFeedbacks.length);
        selected.push(this.fiveStarFeedbacks[randomIndex]);
        this.fiveStarFeedbacks.splice(randomIndex, 1);
      }

      this.view.displayFeedback(selected);
      
    } else {
      this.view.displayError("No feedbacks with 5-star ratings found.");
    }
  }
}

export default DisplayAppFeedbacksPresenter;
