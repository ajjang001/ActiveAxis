import AllocatePlan from "../model/AllocatePlan";
import FitnessPlan from "../model/FitnessPlan";

class DisplayPlanAllocationPresenter{
    constructor(view){
        this.view = view;
        this.model = new AllocatePlan();
    }

    async displayPlanAllocation(sessionID){
        try{
            const allocatedPlans = await this.model.getAllocatedPlans(sessionID);
            const onProgress = await this.model.getAllocatePlanOnProgressDetails(sessionID);

            const detailedAllocatedPlans = [];
            const detailedOnProgress = [];

            for(const plan of allocatedPlans){
                const planDetails = await new FitnessPlan().getFitnessPlanAllocationDetail(plan.fitnessPlanID);
                detailedAllocatedPlans.push({
                    plan: plan,
                    details: planDetails
                });
            }

            for(const plan of onProgress){
                const planDetails = await new FitnessPlan().getFitnessPlanAllocationDetail(plan.fitnessPlanID);
                detailedOnProgress.push({
                    plan: plan,
                    details: planDetails
                });
            }
            // console.log(detailedOnProgress);
            this.view.updateAllocatedPlans(detailedAllocatedPlans);
            this.view.updateOnProgress(detailedOnProgress);
        }catch(error){
            throw new Error(error.message);
        }
    }

    async deletePlanAllocation(allocationID){
        try{
            await this.model.deleteAllocatePlan(allocationID);
        }catch(error){
            throw new Error(error.message);
        }
    }


}

export default DisplayPlanAllocationPresenter;