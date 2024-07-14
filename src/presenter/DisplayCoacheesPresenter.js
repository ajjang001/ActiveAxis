
import User from '../model/User.js';

class DisplayCoacheesPresenter{
    constructor (view){
        this.view = view;
        this.user = new User();
    }

    async displayCoachees(coachID){
        try{
            this.view.updateCoacheeList(await this.user.getListOfCoachee(coachEmail));
        }catch(error){
            throw new Error(error);
        }
    }


}

export default DisplayCoacheesPresenter;