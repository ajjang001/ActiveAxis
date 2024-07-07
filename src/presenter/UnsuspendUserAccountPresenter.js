import User from '../model/User.js';

class UnsuspendUserAccountPresenter{
    constructor(view){
        this.view = view;
        this.model = new User();
    }

    async unsuspendUser(userID){
        try{
            await this.model.unsuspend(userID);
            
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default UnsuspendUserAccountPresenter;