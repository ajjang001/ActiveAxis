import Friends from "../model/Friends";

class AddFriendPresenter {
  constructor(view) {
    this.view = view;
    this.model = new Friends();
  }

  async addFriend(currentUserId, selectedUserId) {
    try {
      await this.model.addFriend(currentUserId, selectedUserId);
      this.view.updateFriendStatus(selectedUserId, "Pending");
    } catch (error) {
      console.error(error);
      this.view.showError(error.message);
    }
  }

  async cancelFriendRequest(currentUserId, selectedUserId) {
    try {
      await this.model.cancelFriendRequest(currentUserId, selectedUserId);
      this.view.updateFriendStatus(selectedUserId, "Add");
    } catch (error) {
      console.error(error);
      this.view.showError(error.message);
    }
  }
  async searchUsers(searchText, currentUserId) {
    try {
      const result = await this.model.searchUsers(searchText, currentUserId);
      this.view.setUsers(result);
    } catch (error) {
      console.error(error);
      this.view.showError(error.message);
    }
  }
}

export default AddFriendPresenter;
