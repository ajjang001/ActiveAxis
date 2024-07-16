
class DeleteAchievementPresenter{
    constructor(view){
        this.view = view;
        this.achievement = this.view.achievement;
    }

    async deleteAchievement(){
        try{
            // Delete the achievement
            await this.achievement.deleteAchievement();
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default DeleteAchievementPresenter;