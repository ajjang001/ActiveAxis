import Coach from "../model/Coach";

class SuspendCoachAccountPresenter{
    constructor(view){
        this.view = view;
        this.model = new Coach();
    }

    async suspendCoach(coachID){
        try{
            await this.model.suspend(coachID);
            
        }catch(e){
            throw new Error(e.message);
        }
    }

}

export default SuspendCoachAccountPresenter;