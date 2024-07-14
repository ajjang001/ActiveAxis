
import CompetitionType from '../model/CompetitionType.js';

class EditAchievementPresenter{
    constructor(view){
        this.view = view;
    }

    async getCompetitionTypes(){
        try{
            this.view.setOptions(await new CompetitionType().getCompetitionTypes());
        }catch(error){
            throw new Error (error);
        }
    }
}

export default EditAchievementPresenter;