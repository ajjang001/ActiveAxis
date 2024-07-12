import Achievements from '../model/Achievements.js';
import ExerciseType from '../model/ExerciseType.js';

class CreateAchievementPresenter{
    constructor(view){
        this.view = view;
        this.achievement = new Achievements();
    }

    async createAchievement(){
        try{
            const alphanumeric = /^[a-zA-Z0-9\s]+$/;
            const decimal = /^\d+(\.\d+)?$/;

            const typeID = this.view.typeID;
            const name = this.view.name.trim();
            const description = this.view.description.trim();
            const target = this.view.target.toString().trim();
            const photo = this.view.photo;
            

            if (photo === null) {
                throw new Error("Please upload an image.");
            }else if (!name.match(alphanumeric)) {
                throw new Error("Achievement name must be alphanumeric.");
            } else if (!description.match(alphanumeric)) {
                throw new Error("Description must be alphanumeric.");
            } else if (isNaN(target)) {
                throw new Error("Target must be a number.");
            } else if (parseFloat(target) < 0) {
                throw new Error("Target must be a positive number.");
            } else {
                await this.achievement.createAchievement(typeID, name, description, (target.match(decimal) ? parseFloat(target) : parseInt(target)), photo);
            }




        }catch(error){
            throw new Error (error);
        }
    }

    async getExerciseTypes(){
        try{
            this.view.setOptions(await new ExerciseType().getExerciseTypes());
        }catch(error){
            throw new Error (error);
        }
    }
}

export default CreateAchievementPresenter;