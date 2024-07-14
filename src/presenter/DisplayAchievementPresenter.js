import Achievements from "../model/Achievements";

class DisplayAchievementPresenter{
    constructor(view){
        this.view = view;
        this.achievement = new Achievements();
    }

    async displayAchievement(){
        try{
            this.view.displayAchievement(await this.achievement.getAchievement(this.view.achievementID));
        }catch(e){
            throw new Error(e.message);
        }
    }


}

export default DisplayAchievementPresenter;