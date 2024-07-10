
class RejectCoachPresenter{
    constructor(view){
        this.view = view;
        this.coach = this.view.coach;
    }

    async rejectRequest(coachID){
        try{
            await this.coach.rejectCoach(coachID);
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default RejectCoachPresenter;