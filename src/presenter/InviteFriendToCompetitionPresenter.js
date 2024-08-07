import Friends from "../model/Friends";
import Competition from "../model/Competition";

class InviteFriendToCompetitionPresenter {
  constructor(view) {
    this.view = view;
    this.model = null;
  }

  async cancelInvite(competitionID, userID) {
    try{
        this.model = new Competition();
        await this.model.cancelInvite(competitionID, userID);
    }catch(error){
      throw new Error(error);
    }
  }
  
  async inviteFriend(competitionID, userID) {
    try{
        this.model = new Competition();
        await this.model.inviteFriend(competitionID, userID);
    }catch(error){
      throw new Error(error);
    }
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

  async getPendingInvites(competitionID) {
    try{
        this.model = new Competition();
        const pendingInvites = await this.model.getPendingInvites(competitionID);
        this.view.updatePendingInvites(pendingInvites);
    }catch(error){
      throw new Error(error);
    }
  }

  async getMyPendingInvites(userId) {
    try{
      this.model = new Competition();
      this.view.updateCompetitionList(await this.model.getMyPendingInvites(userId));
    }catch(error){
      throw new Error(error);
    }
  }

}

export default InviteFriendToCompetitionPresenter;