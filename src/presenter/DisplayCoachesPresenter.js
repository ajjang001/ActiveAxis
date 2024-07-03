import Coach from '../model/Coach.js';

class DisplayCoachesPresenter{
    constructor(view){
        this.view = view;
    }

    async displayCoaches(){
        try{
            this.view.updateCoachList(await new Coach().getCoachList());
        }catch(error){
            throw new Error(error);
        }
    }
}
export default DisplayCoachesPresenter;