import Friends from '../model/Friends';

class SearchUserPresenter {
  constructor(view, userId) {
    this.view = view;
    this.model = new Friends();
    this.currentUserId = userId;
  }

  async handleSearchUsers(userId, keyword) {
    try{
        if (keyword === '') {
            await this.getFriends(userId);
        }else{
            this.model = new Friends();
            const users = await this.model.handleSearchUsers(userId, keyword);
            this.view.updateFriends(users);
        }
        
    }catch(error){
      throw new Error(error);
    }
  }
}

export default SearchUserPresenter;
