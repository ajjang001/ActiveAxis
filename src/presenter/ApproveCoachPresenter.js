

class ApproveCoachPresenter{
    constructor(view){
        this.view = view;
        this.coach = this.view.coach;
    }

    async approveRequest(coachID){
        try{
            await this.coach.approveCoach(coachID);
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default ApproveCoachPresenter;