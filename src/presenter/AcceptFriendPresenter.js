import Friends from './Friends';

class AcceptFriendPresenter {
  constructor(view, db) {
    this.view = view;
    this.model = new Friends(db);
    this.currentUserId = userId;
  }

  async handleAcceptFriend(selectedUserId) {
    await this.model.respondToFriendRequest(this.currentUserId, selectedUserId, true);
    this.view.refreshFriendRequests(); // Method to refresh the friend requests
  }
}

export default AcceptFriendPresenter;
