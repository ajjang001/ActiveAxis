
import AchievementType from '../model/AchievementType.js';

class EditAchievementPresenter{
    constructor(view){
        this.view = view;
        this.achievement = this.view.oldAchievement;
    }

    async editAchievement(){
        try{
            const decimal = /^\d+(\.\d+)?$/;

            const type = this.view.type;
            const name = this.view.name.trim();
            const description = this.view.description.trim();
            const target = this.view.target.toString().trim();
            const photo = this.view.photo;
            

            if (isNaN(target)) {
                throw new Error("Target must be a number.");
            }else if ( name === "" || description === "" || target === "") {
                throw new Error("Please fill up all fields.");
            }else if (parseFloat(target) < 0) {
                throw new Error("Target must be a positive number.");
            } else {
                await this.achievement.editAchievement( type, name, description, (target.match(decimal) ? parseFloat(target) : parseInt(target)), photo);
            }




        }catch(error){
            throw new Error (error);
        }
    
    }

    async getAchievementTypes(){
        try{
            this.view.setOptions(await new AchievementType().getAchievementTypes());
        }catch(error){
            throw new Error (error);
        }
    }
}

export default EditAchievementPresenter;