import Coach from '../model/Coach.js';

class HireCoachPresenter{
    constructor(view){
        this.view = view;
        this.coach = new Coach();
    }

    async displayCoaches(){
        try{
            //this.view.updateCoachList(await this.coach.getCoachList());
        }catch(error){
            throw new Error(error);
        }
    }
}
export default HireCoachPresenter;