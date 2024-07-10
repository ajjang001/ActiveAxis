import Coach from "../model/Coach";

class DisplayCoachRequestDetailsPresenter{
    constructor(view){
        this.view = view;
        this.coach = this.view.coach;
    }

    async displayDocuments(){
        try{
            const docs = await this.coach.getDocuments();
            this.view.updateResume(docs.resumeURL);
            this.view.updateCert(docs.certURL);
            this.view.updateID(docs.idURL);
        }catch(e){
            throw new Error(e.message);
        }
    }


}

export default DisplayCoachRequestDetailsPresenter;