import Achievements from '../model/Achievements.js';
import ExerciseType from '../model/ExerciseType.js';

class CreateAchievementPresenter{
    constructor(view){
        this.view = view;
        this.achievement = new Achievements();
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