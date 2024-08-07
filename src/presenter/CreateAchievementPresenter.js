import Achievements from '../model/Achievements.js';
import AchievementType from '../model/AchievementType.js';

class CreateAchievementPresenter{
    constructor(view){
        this.view = view;
        this.achievement = new Achievements();
    }

    async createAchievement(){
        try{
            const decimal = /^\d+(\.\d+)?$/;

            const type = this.view.type;
            const name = this.view.name.trim();
            const description = this.view.description.trim();
            const target = this.view.target.toString().trim();
            const photo = this.view.photo;
            

            if (photo === null) {
                throw new Error("Please upload an image.");
            }else if (name === "" || description === "" || target === "") {
                throw new Error("Please fill out all fields.");
            }else if (isNaN(target)) {
                throw new Error("Target must be a number.");
            } else if (parseFloat(target) < 0) {
                throw new Error("Target must be a positive number.");
            } else {
                await this.achievement.createAchievement(type, name, description, (target.match(decimal) ? parseFloat(target) : parseInt(target)), photo);
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

export default CreateAchievementPresenter;