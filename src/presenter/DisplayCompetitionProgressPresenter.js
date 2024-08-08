import CompetitionLeaderboard from "../model/CompetitionLeaderboard";


class DisplayCompetitionProgressPresenter{
    constructor(view){
        this.view = view;
        this.model = new CompetitionLeaderboard();
    }

    async updateUserCompetitionProgress(userID, steps){
        try{
            await this.model.updateLeaderboard(userID, steps);

            
        }catch(error){
            throw new Error(error);
        }
    }

    async getUserCompetitionProgress(userID, competitions){
        try{
            const progress = [];
            for(const c of competitions){
                const p = await this.model.getCompetitionProgress(userID, c.competitionID);
                progress.push(p);
            }

            this.view.updateProgress(progress);

        }catch(error){
            throw new Error(error);
        }
    }


}

export default DisplayCompetitionProgressPresenter;