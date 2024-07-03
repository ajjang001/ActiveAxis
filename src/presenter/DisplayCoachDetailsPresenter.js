import CoachingFeedback from "../model/CoachingFeedback";

class DisplayCoachDetailsPresenter{
    constructor(view){
        this.view = view;
    }

    async displayCoachFeedbacks(){
        try{
            const coachID = this.view.coachID;
            this.view.updateFeedback(await new CoachingFeedback().getCoachFeedbacks(coachID));
        }catch(error){
            throw new Error(error);
        }
    }
}

export default DisplayCoachDetailsPresenter;