import AchievementType from "../model/AchievementType";

class ManageAchievementTypePresenter{
    constructor(view){
        this.view = view;
        this.achievementType = new AchievementType();
    }

    async getAchievementTypes(){
        try{
            const achievementType = await this.achievementType.getAchievementTypes();
            this.view.displayAchievementTypes(achievementType);
        }catch(e){
            throw new Error(e);
        }
    }
}

export default ManageAchievementTypePresenter;