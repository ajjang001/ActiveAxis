import Competition from "../model/Competition";
class DeleteCompetitionPresenter{
    constructor(view){
        this.view = view;
        this.model = new Competition();
    }

    async deleteCompetition(competitionID){
        try{
            await this.model.deleteCompetition(competitionID);
        }catch(error){
            throw new Error(error);
        }
    }
}
export default DeleteCompetitionPresenter;