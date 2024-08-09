import Competition from "../model/Competition";

class DisplayCompetitionHistoryPresenter{
    constructor(view){
        this.view = view;
        this.model = new Competition();
    }

    async getCompetitionHistory(userID){
        try{
            this.view.updateCompetitions(await this.model.getCompetitionHistory(userID));
        }catch(err){
            throw new Error(err);
        }
    }
}

export default DisplayCompetitionHistoryPresenter;