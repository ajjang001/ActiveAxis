import Competition from "../model/Competition";
import CompetitionType from "../model/CompetitionType";

class DisplayCompetitionsPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async loadCompetitions(userid){
        this.model = new Competition();
        let competitionList = await this.model.getCompetitions(userid);
        this.view.updateMyCompetitions(competitionList.myCompetitions);
        this.view.updateParticipatedCompetitions(competitionList.participatedCompetitions);
    }

    async getCompetitionType(typeID){
        try{
            this.model = new CompetitionType();
            return await this.model.getCompetitionType(typeID);
        }catch(error){
            throw new Error(error);
        }
    }

}

export default DisplayCompetitionsPresenter;