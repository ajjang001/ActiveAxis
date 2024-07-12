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
            const category = this.view.category.toString().trim();
            const name = this.view.name.trim();
            console.log(name);
            console.log(name.match(alphanumeric));
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
            } else if (target < 0) {
                throw new Error("Target must be a positive number.");
            } else {
                console.log("Achievement created successfully.");
            }

            // if(category.trim('') === '' || name.trim('') || description.trim() || target.toString().trim()){
            //     throw new Error("Please fill in all fields.");
            // }else if (!name.match(alphanumeric)) {
            //     throw new Error("Achievement name must be alphanumeric.");
            // }else if (!description.match(alphanumeric)) {
            //     throw new Error("Description must be alphanumeric.");
            // }else if (target)




        }catch(error){
            throw new Error (error);
        }
    }

    async getExerciseType(){
        try{
            this.view.setOptions(await new ExerciseType().getExerciseType());
        }catch(error){
            throw new Error (error);
        }
    }
}

export default CreateAchievementPresenter;