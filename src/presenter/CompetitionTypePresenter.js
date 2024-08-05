import CompetitionType from '../model/CompetitionType';

class CompetitionTypePresenter {
    constructor(view) {
        this.view = view;
        this.competitionTypeModel = new CompetitionType();
        this.competitionTypes = [];
    }

    async loadCompetitionTypes() {
        try {
            this.competitionTypes = await this.competitionTypeModel.getCompetitionTypes();
            console.log('Loaded competition types:', this.competitionTypes);  // Debug log
            this.view.updateCompetitionTypes(this.competitionTypes);
        } catch (error) {
            console.error('Failed to load competition types:', error);
        }
    }

    async addCompetitionType(newType) {
        try {
            const newTypeID = await this.competitionTypeModel.addCompetitionType(newType);
            const newCompetitionType = new CompetitionType();
            newCompetitionType.competitionTypeID = newTypeID;
            newCompetitionType.competitionTypeName = newType;
            this.competitionTypes.push(newCompetitionType);
            this.view.updateCompetitionTypes(this.competitionTypes);
        } catch (error) {
            console.error('Failed to add competition type:', error);
        }
    }

    async updateCompetitionType(index, updatedTypeName) {
        try {
            const type = this.competitionTypes[index];
            await this.competitionTypeModel.updateCompetitionType(type.competitionTypeID, updatedTypeName);
            this.competitionTypes[index].competitionTypeName = updatedTypeName;
            this.view.updateCompetitionTypes(this.competitionTypes);
        } catch (error) {
            console.error('Failed to update competition type:', error);
        }
    }
}

export default CompetitionTypePresenter;
