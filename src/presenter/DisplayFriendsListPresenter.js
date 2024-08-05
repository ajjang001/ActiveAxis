import Friends from './Friends';

class DisplayFriendListPresenter {
  constructor(view, db) {
    this.view = view;
    this.model = new Friends(db);
    this.currentUserId = userId;
  }

  async loadFriends() {
    const friends = await this.model.getFriends(this.currentUserId);
    this.view.displayFriends(friends);
  }
}

export default DisplayFriendListPresenter;
