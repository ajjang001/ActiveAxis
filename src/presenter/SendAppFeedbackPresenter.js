import AppFeedback from '../model/AppFeedback';
import { db } from '../firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

class SendAppFeedbackPresenter {
  constructor(view) {
    this.view = view;
    this.appFeedback = new AppFeedback();
  }

  async fetchFeedbacks(accountID) {
    try {
      const feedbackList = await this.appFeedback.fetchFeedbacks(accountID);
      this.view.displayFeedbacks(feedbackList);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  }

  async submitFeedback(feedback) {
    try {
      const feedbackCollection = collection(db, 'appfeedback');
      await addDoc(feedbackCollection, feedback);
      this.view.onFeedbackSubmitted();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }
}

export default SendAppFeedbackPresenter;
