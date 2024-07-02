import Coach from "../model/Coach";

class DisplayCoachRegistrationPresenter{
    constructor(view){
        this.view = view;
    }

    async displayListOfCoachRegistration(){
        try{
            this.view.updateCoachList( await new Coach().getListOfCoachRegistration());
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default DisplayCoachRegistrationPresenter;