
class DisplayFitnessPlanPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async loadRoutines(){
        try{
            this.model = this.view.fitnessPlan;
            await this.model.loadRoutines();
        }catch(e){
            throw new Error(e);
        }

    }
}
export default DisplayFitnessPlanPresenter;