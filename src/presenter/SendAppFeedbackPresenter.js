import AppFeedback from '../model/AppFeedback';
import { db } from '../firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

class SendAppFeedbackPresenter {
  constructor(view) {
    this.view = view;
    this.appFeedback = new AppFeedback();
  }

  async fetchFeedback(accountID) {
    try {
      const feedback = await this.appFeedback.fetchFeedback(accountID);
      
      this.view.displayFeedback(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  }

  async submitFeedback(feedback) {
    try {
      if (feedback.feedbackText.trim() === '') {
        throw new Error("Feedback text cannot be empty.");
      }
      if (feedback.rating === 0) {
        throw new Error("Rating cannot be 0.");
      }
      const feedbackCollection = collection(db, 'appfeedback');
      await addDoc(feedbackCollection, feedback);
      this.view.onFeedbackSubmitted();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default SendAppFeedbackPresenter;
