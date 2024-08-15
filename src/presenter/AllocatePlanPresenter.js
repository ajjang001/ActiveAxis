import FitnessPlan from "../model/FitnessPlan";
import AllocatePlan from "../model/AllocatePlan";

class AllocatePlanPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async getPlans(coachID, userInfo){
        try{
            this.view.updateRecommendedPlan(await new FitnessPlan().getRecommendedPlan(coachID, userInfo));
            this.view.updateOtherPlan(await new FitnessPlan().getOtherPlan(coachID, userInfo));
        }catch(error){
            throw new Error(error);
        }
    }

    async addAllocatePlan(startDate, endDate){
        try{
            this.model = new AllocatePlan();
            const fitnessPlanID = this.view.fitnessPlanID;
            const history = this.view.history;

            // convert firebase timestamp to date
            const sessionEndDate = new Date(history.endDate.toDate());

            if (startDate === null || endDate === null){
                throw new Error("Please select start date");
            }else if (endDate > sessionEndDate){
                throw new Error("End date cannot be later than this session end date");
            }else{
                
                await this.model.addAllocatePlan(fitnessPlanID, history.id, startDate, endDate);
                
            }

            

        }catch(error){
            throw new Error(error);
        }
    }
}

export default AllocatePlanPresenter;