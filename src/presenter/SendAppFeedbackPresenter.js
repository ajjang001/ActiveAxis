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
      // console.log(feedback);
      this.view.displayFeedback(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
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
