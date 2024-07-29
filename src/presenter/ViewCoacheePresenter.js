
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
            return await this.user.getFitnessGoalName(fitnessGoalID);
        }catch(error){
            throw new Error(error);
        }
    }

    async getFitnessLevelName(fitnessLevelID){
        try{
            return await this.user.getFitnessLevelName(fitnessLevelID);
        }catch(error){
            throw new Error(error);
        }
    }


}

export default ViewCoacheePresenter;