import Coach from "../model/Coach";

class SearchCoachAccountPresenter{
    constructor(view){
        this.view = view;
    }

    async searchCoachAccount(search){
        try{
            this.view.updateCoachList(await new Coach().search(search.trim()));
        }catch(e){
            throw new Error(e);
        }
    }
}

export default SearchCoachAccountPresenter;