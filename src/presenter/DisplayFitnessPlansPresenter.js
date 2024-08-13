import AllocatePlan from "../model/AllocatePlan";
import CoachingHistory from "../model/CoachingHistory";
import FitnessPlan from "../model/FitnessPlan";


class DisplayFitnessPlansPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async getCurrentSession(userID){
        try{
            this.model = new CoachingHistory();
            const session = await this.model.getCurrentSession(userID);
            
            this.view.updateSession(session.session);
        }catch(e){
            console.log(e.message);
            throw new Error(e.message);
        }
    }

    async displayPlanAllocation(sessionID){
        try{
            this.model = new AllocatePlan();

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
            this.view.updateAllocatedPlans(detailedAllocatedPlans);
            this.view.updateOnProgress(detailedOnProgress);

        }catch(error){
            throw new Error(error.message);
        }
    }

    
}

export default DisplayFitnessPlansPresenter;