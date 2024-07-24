import AppFeedback from '../model/AppFeedback';
import { db } from '../firebase/firebaseConfig';
import { addDoc, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

class UpdateAppFeedbackPresenter {
  constructor(view) {
    this.view = view;
    this.appFeedback = new AppFeedback();
  }

  async fetchFeedbacks() {
    try {
      const feedbackList = await this.appFeedback.fetchFeedbacks();
      this.view.displayFeedbacks(feedbackList);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  }

  async submitFeedback(feedback) {
    try {
      const feedbackCollection = collection(db, 'appfeedback');
      await addDoc(feedbackCollection, feedback);
      this.view.onFeedbackSubmitted(feedback);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }

  async updateFeedback(feedbackId, updatedFeedback) {
    try {
      const feedbackDocRef = doc(db, 'appfeedback', feedbackId);
      await updateDoc(feedbackDocRef, updatedFeedback);
      this.view.onFeedbackUpdated();
    } catch (error) {
      console.error("Error updating feedback:", error);
    }
  }
}

export default UpdateAppFeedbackPresenter;
