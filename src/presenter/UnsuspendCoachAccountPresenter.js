import Coach from '../model/Coach.js';

class UnsuspendCoachAccountPresenter{
    constructor(view){
        this.view = view;
        this.model = new Coach();
    }

    async unsuspendCoach(coachID){
        try{
            await this.model.unsuspend(coachID);
            
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default UnsuspendCoachAccountPresenter;