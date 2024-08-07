import Friends from '../model/Friends';

class DisplayFriendDetailsPresenter {
  constructor(view, db) {
      this.view = view;
      this.model = new Friends(db);
  }

  async loadFriendDetails(selectedUserId) {
      try {
          const friendDetails = await this.model.getFriendDetails(selectedUserId);
          this.view.displayFriendDetails(friendDetails);
      } catch (error) {
          console.error("Failed to load friend details:", error);
      }
  }
}

export default DisplayFriendDetailsPresenter;
