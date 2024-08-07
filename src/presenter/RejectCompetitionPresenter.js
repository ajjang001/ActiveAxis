import Competition from "../model/Competition";

class RejectCompetitionPresenter{
    constructor(view){
        this.view = view;
        this.model = new Competition();
    }

    async rejectInvitation(userId, competitionId){
        try{
            await this.model.rejectInvitation(userId, competitionId);
        }catch(error){
            throw new Error(error);
        }
    }
}

export default RejectCompetitionPresenter;