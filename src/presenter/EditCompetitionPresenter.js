import CompetitionType from "../model/CompetitionType";
import Competition from "../model/Competition";

class EditCompetitionPresenter{
    constructor(view){
        this.view = view;
        this.model = null; 
    }

    async getCompetitionTypes(){
        try{
            this.model = new CompetitionType();
            const types = await this.model.getCompetitionTypes();
            this.view.updateDropdown(types);
        }catch(error){
            throw new Error (error);
        }
    }

    async editCompetitionDetails(name, type, startDate, endDate, target, details, competitionID){
        try{
            const isNumber = /^\d+$/;

            if (name === ''){
                throw new Error ('Please fill in competition name field');
            }else if (!startDate) {
                throw new Error ('Please fill in start date field');
            }else if (!endDate){
                throw new Error ('Please fill in end date field');
            } else if (details === ''){
                throw new Error ('Please fill in competition details field');
            }else{
                if(type === 1){
                    // Be there first
                    if(isNumber.test(target) === false){
                        throw new Error ('Please fill in target field with number only');
                    }else{

                        if(target <= 0){
                            throw new Error ('Please fill in target field');
                        }else{
                            const next2Week = new Date(startDate);
                            next2Week.setDate(next2Week.getDate() + 14);
                            next2Week.setHours(0, 0, 0, 0);

                            this.model = new Competition();
                            await this.model.editCompetition(name, type, startDate, endDate, target, details, competitionID);
                        }

                    }
                    
                }

                if (type === 2){
                    // Steps Champion
                    if (startDate >= endDate){
                        throw new Error ('End date must be later than start date');
                    }else{
                        this.model = new Competition();
                        await this.model.editCompetition(name, type, startDate, endDate, target, details, competitionID);
                    }

                }
            }

        }catch(error){
            throw new Error (error);
        }
    }
}

export default EditCompetitionPresenter;