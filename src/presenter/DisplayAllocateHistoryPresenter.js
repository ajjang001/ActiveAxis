import { all } from 'axios';
import AllocatePlan from '../model/AllocatePlan';
import FitnessPlan from '../model/FitnessPlan';

class DisplayAllocateHistoryPresenter{
    constructor(view){
        this.view = view;
        this.model = new AllocatePlan();
    }

    async displayAllocationHistory(sessionID){
        try{
            const allocatePlans = await this.model.getAllocatePlanHistoryDetails(sessionID);

            const detailedPlan = [];

            for(const plan of allocatePlans){
                const planDetails = await new FitnessPlan().getFitnessPlanAllocationDetail(plan.fitnessPlanID);
                detailedPlan.push({
                    plan: plan,
                    details: planDetails
                });
            }
            this.view.updateHistory(detailedPlan);
        }catch(error){
            throw new Error(error.message);
        }
    }
}

export default DisplayAllocateHistoryPresenter;