import CompetitionLeaderboard from "../model/CompetitionLeaderboard";

class DisplayLeaderboardPresenter{
    constructor(view){
        this.view = view;
        this.model = new CompetitionLeaderboard();
    }

    async getLeaderboard(competitionID){
        try{
            this.view.updateLeaderboard(await this.model.getLeaderboard(competitionID));
        }catch(error){
            throw new Error(error);
        }
    }
}

export default DisplayLeaderboardPresenter;