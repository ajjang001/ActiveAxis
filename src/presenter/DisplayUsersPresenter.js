
import User from '../model/User.js';

class DisplayUsersPresenter{
    constructor (view){
        this.view = view;
        this.user = new User();
    }

    async displayUsers(filter){
        try{
            this.view.updateUserList(await this.user.getUserList(filter));
        }catch(error){
            throw new Error(error);
        }
    }


}

export default DisplayUsersPresenter;