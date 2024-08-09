import Friends from '../model/Friends';

class AcceptFriendPresenter {
  constructor(view) {
    this.view = view;
    this.model = new Friends();
  }

  async acceptFriend(currentUserId, selectedUserId) {
    try {
      await this.model.respondToFriendRequest(currentUserId, selectedUserId, true);
      this.view.onFriendAccepted(selectedUserId);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}

export default AcceptFriendPresenter;
