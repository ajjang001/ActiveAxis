import Achievements from "../model/Achievements";
import AchievementsObtained from "../model/AchievementsObtained";


class DisplayAchievementPresenter {
    constructor(view) {
        this.view = view;
        this.achievement = new Achievements();
    }

    async displayAchievement() {
        try {
            this.view.displayAchievement(await this.achievement.getAchievement(this.view.achievementID));
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async fetchUserAchievements(userID, setAchievements, setObtainedAchievements) {
        try {
            this.achievementObtained = new AchievementsObtained();
            const achievementsData = await this.achievementObtained.getAllAchievements();
            const obtainedData = await this.achievementObtained.getUserAchievements(userID);
            setAchievements(achievementsData);
            setObtainedAchievements(obtainedData);
        } catch (e) {
            throw new Error(e.message);
        }
    }

}

export default DisplayAchievementPresenter;