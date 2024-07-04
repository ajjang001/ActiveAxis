import CoachingFeedback from "../model/CoachingFeedback";

class DisplayCoachDetailsPresenter{
    constructor(view){
        this.view = view;
        this.coachingFeedback = new CoachingFeedback();
    }

    async displayCoachFeedbacks(){
        try{
            const coachID = this.view.coachID;
            this.view.updateFeedback(await this.coachingFeedback.getCoachFeedbacks(coachID));
        }catch(error){
            throw new Error(error);
        }
    }
}

export default DisplayCoachDetailsPresenter;