import Friends from '../model/Friends';

class DisplayFriendRequestsPresenter {
  constructor(view) {
    this.view = view;
    this.model = new Friends();
  }

  async fetchRequests(userId) {
    try {
      const requests = await this.model.getFriendRequests(userId);
      this.view.onRequestsFetched(requests);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}

export default DisplayFriendRequestsPresenter;
