import Friends from './Friends';

class SearchUserPresenter {
  constructor(view, db) {
    this.view = view;
    this.model = new Friends(db);
    this.currentUserId = userId; // Replace with actual logic to get current logged-in user ID
  }

  async handleSearchUsers(searchText) {
    const users = await this.model.searchUsers(searchText, this.currentUserId);
    this.view.displaySearchedUsers(users);
  }
}

export default SearchUserPresenter;
