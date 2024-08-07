import Competition from "../model/Competition";

class LeaveCompetitionPresenter{
    constructor(view){
        this.view = view;
        this.model = new Competition();
    }

    async leaveCompetition(userID, competitionID){
        try{
            await this.model.leaveCompetition(userID, competitionID)
        }catch(error){
            throw new Error(error);
        }
    }


}

export default LeaveCompetitionPresenter;