import User from '../model/User.js';

class DisplayAccountDetailsPresenter{
    constructor (view){
        this.view = view;
        this.user = new User();
    }

    async viewAccountDetails(userEmail){
        try{
            this.view.viewAccountDetails(await this.user.getCoacheeDetails(userEmail));
        }catch(error){
            throw new Error(error);
        }
    }


}

export default DisplayAccountDetailsPresenter;