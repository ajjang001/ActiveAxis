
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
            const name = await this.user.getFitnessGoalName(fitnessGoalID);
            
            this.view.updateGoal (name);
        }catch(error){
            throw new Error(error);
        }
    }

    async getFitnessLevelName(fitnessLevelID){
        try{
            const name = await this.user.getFitnessLevelName(fitnessLevelID);
            
            this.view.updateLevel(name);
        }catch(error){
            throw new Error(error);
        }
    }


}

export default ViewCoacheePresenter;