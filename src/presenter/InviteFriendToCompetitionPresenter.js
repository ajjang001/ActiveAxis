import Friends from "../model/Friends";

class InviteFriendToCompetitionPresenter {
  constructor(view) {
    this.view = view;
    this.model = null;
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

  async searchFriend(userId, keyword) {
    try{
        if (keyword === '') {
            await this.getFriends(userId);
        }else{
            this.model = new Friends();
            const users = await this.model.searchFriend(userId, keyword);
            this.view.updateFriends(users);
        }
        
    }catch(error){
      throw new Error(error);
    }
  }

}

export default InviteFriendToCompetitionPresenter;