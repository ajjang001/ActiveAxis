
import User from '../model/User.js';

class ViewCoacheePresenter{
    constructor (view){
        this.view = view;
        this.user = new User();
    }

    async viewCoacheeDetails(userEmail){
        try{
            this.view.loadCoacheeDetails(await this.user.getCoacheeDetails(userEmail));
        }catch(error){
            throw new Error(error);
        }
    }

    async getFitnessGoalName(fitnessGoalID){
        try{
            console.log(fitnessGoalID);
            const name = await this.user.getFitnessGoalName(fitnessGoalID);
            console.log(name);
            this.view.updateGoal (name);
        }catch(error){
            throw new Error(error);
        }
    }

    async getFitnessLevelName(fitnessLevelID){
        try{
            console.log(fitnessLevelID);
            const name = await this.user.getFitnessLevelName(fitnessLevelID);
            console.log(name);
            this.view.updateLevel(name);
        }catch(error){
            throw new Error(error);
        }
    }


}

export default ViewCoacheePresenter;