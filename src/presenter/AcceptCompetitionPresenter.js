
import Competition from "../model/Competition";

class AcceptCompetitionPresenter{
    constructor(view){
        this.view = view;
        this.model = new Competition();
    }

    async acceptInvitation(userId, competitionId){
        try{
            await this.model.acceptInvitation(userId, competitionId);
        }catch(error){
            throw new Error(error);
        }
    }
}

export default AcceptCompetitionPresenter;