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

}

export default InviteFriendToCompetitionPresenter;