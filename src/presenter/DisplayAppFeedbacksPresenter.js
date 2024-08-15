import AppFeedback from '../model/AppFeedback';

class DisplayAppFeedbacksPresenter {
  constructor(view) {
    this.view = view;
    this.af = new AppFeedback();
    this.fiveStarFeedbacks = [];
  }

  async loadFeedbacks() {
    try {
      const feedbacks = await this.af.fetchFeedbacks();
      this.fiveStarFeedbacks = feedbacks.filter((feedback) => feedback.rating === 5);
      this.displayLatestFeedback();
    } catch (error) {
      this.view.displayError(error.message);
    }
  }

  displayLatestFeedback(){
    try{
      // Sort the top 5 latest feedbacks (using dateSubmitted - type is Firebase timestamp)
      const sortedFeedbacks = this.fiveStarFeedbacks.sort((a, b) => b.dateSubmitted - a.dateSubmitted).slice(0, 5);

      this.view.displayFeedback(sortedFeedbacks);
      
    }catch(error){
      this.view.displayError(error.message);
    }
  }

  displayRandomFeedback() {
    if (this.fiveStarFeedbacks.length > 0) {
      const selected = [];
      for (let c = 1 ; c <= 10 ; c++){
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
