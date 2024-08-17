import AllocatePlan from '../model/AllocatePlan.js';
import ExerciseHistory from '../model/ExerciseHistory.js';
import FitnessPlan from '../model/FitnessPlan.js';

class DisplayExerciseHistoryPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async displayExerciseHistory(date, userID){
        try{
            this.model = new ExerciseHistory();
            this.view.updateHistory(await this.model.getExerciseHistory(date, userID));
            
        }catch(error){
            throw new Error(error);
        }
    }

    async displayExerciseAllocationHistory(sessionID){
        try{
            this.model = new AllocatePlan();
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

export default DisplayExerciseHistoryPresenter;