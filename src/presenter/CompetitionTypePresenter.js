import CompetitionType from '../model/CompetitionType';

class CompetitionTypePresenter {
    constructor(view) {
        this.view = view;
        this.competitionTypeModel = new CompetitionType();
    }

    async loadCompetitionTypes() {
        try {
            const competitionTypes =  await this.competitionTypeModel.getCompetitionTypes();
            this.view.updateCompetitionTypes(competitionTypes);
        } catch (error) {
            throw new Error(e);
        }
    }

    async addCompetitionType(newType, competitionTypes) {
        try {
            const newTypeID = await this.competitionTypeModel.addCompetitionType(newType);
            const newCompetitionType = new CompetitionType();
            newCompetitionType.competitionTypeID = newTypeID;
            newCompetitionType.competitionTypeName = newType;
            competitionTypes.push(newCompetitionType);
            this.view.updateCompetitionTypes(competitionTypes);
        } catch (error) {
            console.error('Failed to add competition type:', error);
        }
    }

    async updateCompetitionType(index, updatedTypeName, competitionTypes) {
        try {
            const type = competitionTypes[index];
            await this.competitionTypeModel.updateCompetitionType(type.competitionTypeID, updatedTypeName);
            competitionTypes[index].competitionTypeName = updatedTypeName;
            this.view.updateCompetitionTypes(competitionTypes);
        } catch (error) {
            console.error('Failed to update competition type:', error);
        }
    }
}

export default CompetitionTypePresenter;
