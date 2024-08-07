import User from "../model/User";

class DisplayCompetitionDetailsPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async getUserDetails(userID){
        try{
            this.model = new User();
            return await this.model.getInfoByID(userID);
        }catch(error){
            throw new Error(error);
        }
    }
}

export default DisplayCompetitionDetailsPresenter;