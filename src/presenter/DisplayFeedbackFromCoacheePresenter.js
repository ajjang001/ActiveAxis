import CoachingFeedback from "../model/CoachingFeedback";

class DisplayFeedbackFromCoacheePresenter{
    constructor(view){
        this.view = view;
        this.coachingFeedback = new CoachingFeedback();
    }

    async displayCoachFeedbacks(coachEmail){
        try{
            this.view.coachEmail;
            this.view.updateFeedback(await this.coachingFeedback.getCoacheeFeedbacks(coachEmail));
        }catch(error){
            throw new Error(error);
        }
    }
}

export default DisplayFeedbackFromCoacheePresenter;