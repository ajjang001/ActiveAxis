import Friends from './Friends';

class RemoveFriendPresenter {
  constructor(view, db) {
    this.view = view;
    this.model = new Friends(db);
    this.currentUserId = userId;
  }

  async handleRemoveFriend(selectedUserId) {
    await this.model.removeFriend(this.currentUserId, selectedUserId);
    this.view.refreshFriendList(); // Method to refresh the friend list
  }
}

export default RemoveFriendPresenter;
