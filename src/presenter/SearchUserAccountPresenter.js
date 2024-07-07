import User from "../model/User";

class SearchUserAccountPresenter{
    constructor(view){
        this.view = view;
        this.user = new User();
    }

    async searchUserAccount(search){
        try{
            this.view.updateUserList(await this.user.search(search.trim()));
        }catch(e){
            throw new Error(e);
        }
    }
}

export default SearchUserAccountPresenter;