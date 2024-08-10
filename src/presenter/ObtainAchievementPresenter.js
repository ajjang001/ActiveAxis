import Achievements from "../model/Achievements";
import AchievementsObtained from "../model/AchievementsObtained";

class ObtainAchievementPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async checkAchievementSteps(userID, steps){
        try{
            console.log("Checking achievements for steps");
            const justObtained = [];

            // Get all achievements related to steps
            const achievements = await new Achievements().getStepsAchievements();
            console.log(achievements);

            // Check if user has reached enough steps to unlock an achievement
            for(let i = 0; i < achievements.length; i++){
                if(steps >= achievements[i].maxProgress){
                    // Check if user has already unlocked the achievement
                    const achievementObtained = await new AchievementsObtained().checkAchievement(userID, achievements[i].achievementID);
                    if(achievementObtained === null){
                        // Unlock the achievement
                        await new AchievementsObtained().unlockAchievement(userID, achievements[i].achievementID);
                        justObtained.push(achievements[i].achievementName);
                    }
                }
            }

            if(justObtained.length > 0){
                console.log("Achievements obtained: ", justObtained);
                return justObtained;
            }
            console.log("No achievements obtained");
            return null;

        }catch(err){
            throw new Error(err.message);
        }
    }

    async checkAchievementCompetition(userID, competitionList){
        try{
            const justObtained = [];
            
            // Get all achievements related to competition
            const achievements = await new Achievements().getCompetitionsAchievements();

            // Get number of competitions won by user
            const wonCompetitionsCount = competitionList.filter((competition)=>competition.position === 1).length;

            // Check if user has won enough competitions to unlock an achievement
            for(let i = 0; i < achievements.length; i++){
                if(wonCompetitionsCount >= achievements[i].maxProgress){
                    // Check if user has already unlocked the achievement
                    const achievementObtained = await new AchievementsObtained().checkAchievement(userID, achievements[i].achievementID);
                    if(achievementObtained === null){
                        // Unlock the achievement
                        await new AchievementsObtained().unlockAchievement(userID, achievements[i].achievementID);
                        justObtained.push(achievements[i].achievementName);
                    }
                }
            }

            if(justObtained.length > 0){
                return justObtained;
            }else{
                return null;
            }

        }catch(err){
            throw new Error(err.message);
        }
    }
}

export default ObtainAchievementPresenter;