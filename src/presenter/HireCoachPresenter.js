import CoachingHistory from '../model/CoachingHistory.js';

class HireCoachPresenter{
    constructor(view){
        this.view = view;
        this.history = new CoachingHistory();
    }

    async displayCoaches(setCoaches){
        try{
            const coaches = await this.history.getCoaches();
            setCoaches(coaches);
        }catch(error){
            throw new Error(error);
        }
    }
}
export default HireCoachPresenter;