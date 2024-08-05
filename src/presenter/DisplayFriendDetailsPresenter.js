import Friends from './Friends';

class DisplayFriendDetailsPresenter {
  constructor(view, db) {
    this.view = view;
    this.model = new Friends(db);
    this.currentUserId = userId;
  }

  async loadFriendDetails(selectedUserId) {
    const friendDetails = await this.model.getFriendDetails(selectedUserId);
    this.view.displayFriendDetails(friendDetails);
  }
}

export default DisplayFriendDetailsPresenter;
