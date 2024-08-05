import Competition from "../model/Competition";

class DisplayCompetitionsPresenter{
    constructor(view){
        this.view = view;
        this.model = new Competition();
    }

    async loadCompetitions(userid){
        let competitionList = await this.model.getCompetitions(userid);
        console.log(competitionList);
        this.view.updateMyCompetitions(competitionList.myCompetitions);
        this.view.updateParticipatedCompetitions(competitionList.participatedCompetitions);
    }

}

export default DisplayCompetitionsPresenter;