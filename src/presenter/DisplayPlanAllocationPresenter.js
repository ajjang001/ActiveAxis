import AllocatePlan from "../model/AllocatePlan";
import FitnessPlan from "../model/FitnessPlan";

class DisplayPlanAllocationPresenter{
    constructor(view){
        this.view = view;
        this.model = new AllocatePlan();
    }

    async displayPlanAllocation(sessionID){
        try{
            const onProgress = await this.model.getAllocatePlanOnProgressDetails(sessionID);

            const detailedOnProgress = [];

            for(const plan of onProgress){
                const planDetails = await new FitnessPlan().getFitnessPlanAllocationDetail(plan.fitnessPlanID);
                detailedOnProgress.push({
                    plan: plan,
                    details: planDetails
                });
            }
            // console.log(detailedOnProgress);
            this.view.updateOnProgress(detailedOnProgress);
        }catch(error){
            throw new Error(error.message);
        }
    }


}

export default DisplayPlanAllocationPresenter;