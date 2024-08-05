import Friends from '../model/Friends';

class RejectFriendPresenter {
  constructor(view, db) {
    this.view = view;
    this.model = new Friends(db);
    this.currentUserId = userId;
  }

  async handleRejectFriend(selectedUserId) {
    await this.model.respondToFriendRequest(this.currentUserId, selectedUserId, false);
    this.view.refreshFriendRequests(); // Method to refresh the friend requests
  }
}

export default RejectFriendPresenter;
