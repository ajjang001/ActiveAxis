import SystemAdmin from "../model/SystemAdmin";

class UpdateAccountDetailsPresenter{
    constructor(view){
        this.view = view;
        this.SystemAdmin = new SystemAdmin();
    }

    async updateAccount(){
        try{
            //
        }catch(error){
            throw new Error(error);
        }
    }
}

export default UpdateAccountDetailsPresenter;