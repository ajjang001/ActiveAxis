
import FitnessPlan from '../model/FitnessPlan.js';

class DisplayListOfFitnessPlanPresenter{
    constructor(view){
        this.view = view;
        this.fitnessPlan = new FitnessPlan();
    }

    async getFitnessPlans(coachID){
        try{
            // updateList
            const fitnessPlans = await this.fitnessPlan.getFitnessPlans(coachID);
            
            fitnessPlans.forEach((fitnessPlan)=>{
                console.log(fitnessPlan.fitnessPlanName);
            }); 
            
            this.view.updateList(fitnessPlans);
            
        }catch(e){
            throw new Error(e);
        }

    }
}

export default DisplayListOfFitnessPlanPresenter;