import Achievements from "../model/Achievements";

class DisplayListOfAchievementsPresenter{
    constructor(view){
        this.view = view;
        this.achievement = new Achievements();
    }

    async getAchievements(){
        try{
            const achievements = await this.achievement.getListOfAchievements();
            this.view.displayAchievements(achievements);
        }catch(e){
            throw new Error(e);
        }
    }
}

export default DisplayListOfAchievementsPresenter;