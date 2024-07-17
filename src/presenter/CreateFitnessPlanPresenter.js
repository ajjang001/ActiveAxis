import WorkoutRoutine from '../model/WorkoutRoutine.js';

class CreateFitnessPlanPresenter{
    constructor (view){
        this.view = view;
        this.model = null;
    }

    addRoutine(){
        try{
            const routinesSize = this.view.routines.length;
            
            this.model = new WorkoutRoutine();
            this.model.dayNumber = routinesSize + 1;

            this.view.routines.push(this.model);

        }catch(error){
            throw new Error(error);
        }
    }
}

export default CreateFitnessPlanPresenter;