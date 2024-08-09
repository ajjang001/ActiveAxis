import Friends from '../model/Friends';

class RejectFriendPresenter {
  constructor(view) {
    this.view = view;
    this.model = new Friends();
  }

  async rejectFriend(currentUserId, selectedUserId) {
    try {
      await this.model.respondToFriendRequest(currentUserId, selectedUserId, false);
      this.view.onFriendRejected(selectedUserId);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}

export default RejectFriendPresenter;
