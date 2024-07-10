
import User from '../model/User.js';

class SuspendUserAccountPresenter{
    constructor(view){
        this.view = view;
        this.model = new User();
    }

    async suspendUser(userID){
        try{
            await this.model.suspend(userID);
            
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default SuspendUserAccountPresenter;