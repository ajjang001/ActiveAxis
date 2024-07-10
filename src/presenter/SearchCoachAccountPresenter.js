import Coach from "../model/Coach";

class SearchCoachAccountPresenter{
    constructor(view){
        this.view = view;
        this.coach = new Coach();
    }

    async searchCoachAccount(search){
        try{
            this.view.updateCoachList(await this.coach.search(search.trim()));
        }catch(e){
            throw new Error(e);
        }
    }
}

export default SearchCoachAccountPresenter;