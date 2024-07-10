import Coach from "../model/Coach";

class DisplayCoachRegistrationPresenter{
    constructor(view){
        this.view = view;
        this.coach = new Coach();
    }

    async displayListOfCoachRegistration(){
        try{
            this.view.updateCoachList( await this.coach.getListOfCoachRegistration());
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default DisplayCoachRegistrationPresenter;