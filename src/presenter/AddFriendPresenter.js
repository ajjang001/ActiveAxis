import Friends from './Friends';

class AddFriendPresenter {
  constructor(view, db) {
    this.view = view;
    this.model = new Friends(db);
    this.currentUserId = userId;
  }

  async handleAddFriend(selectedUserId) {
    await this.model.addFriend(this.currentUserId, selectedUserId);
    this.view.refreshSearchResults(); // Method to refresh the search results
  }
}

export default AddFriendPresenter;
