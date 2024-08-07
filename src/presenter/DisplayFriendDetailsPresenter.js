import Friends from '../model/Friends';

class DisplayFriendDetailsPresenter {
  constructor(view, db) {
      this.view = view;
      this.model = new Friends(db);
  }

  async loadFriendDetails(friend) {
      try {
        console.log("Details for friend accountID:", friend.accountID);
          const friendDetails = await this.model.getFriendDetails(friend.accountID);
          this.view.displayFriendDetails(friendDetails);
      } catch (error) {
          console.error("Failed to load friend details:", error);
      }
  }
}

export default DisplayFriendDetailsPresenter;
