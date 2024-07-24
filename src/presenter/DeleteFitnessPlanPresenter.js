
class DeleteFitnessPlanPresenter{
    constructor(view){
        this.view = view;
        this.model = null;
    }

    async deleteFitnessPlan(){
        try{
            this.model = this.view.fitnessPlan;
            await this.model.deleteFitnessPlan();
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export default DeleteFitnessPlanPresenter;