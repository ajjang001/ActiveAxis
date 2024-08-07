import Friends from '../model/Friends';

class RemoveFriendPresenter {
  constructor(view, userId) {
    this.view = view;
    this.model = new Friends();
    this.currentUserId = userId;
  }

  async handleRemoveFriend(selectedUserId) {
    await this.model.removeFriend(this.currentUserId, selectedUserId);
    this.view.refreshFriendList(); // Method to refresh the friend list
  }
}

export default RemoveFriendPresenter;
