import Friends from '../model/Friends';

class DisplayFriendsListPresenter {
  constructor(view, userId) {
    this.view = view;
    this.model = new Friends();
    this.currentUserId = userId;
  }

  async getFriends(userId) {
    try{
        this.model = new Friends();
        const friends = await this.model.getFriends(userId);
        this.view.updateFriends(friends);
    }catch(error){
      throw new Error(error);
    }
  }
}

export default DisplayFriendsListPresenter;
