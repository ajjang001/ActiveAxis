class CompetitionTypePresenter {
  constructor(view) {
    this.view = view;
    this.competitionTypes = ['Type 1', 'Type 2', 'Type 3'];
  }

  loadCompetitionTypes() {
    this.view.updateCompetitionTypes(this.competitionTypes);
  }

  addCompetitionType(newType) {
    this.competitionTypes.push(newType);
    this.view.updateCompetitionTypes(this.competitionTypes);
  }

  updateCompetitionType(index, updatedType) {
    this.competitionTypes[index] = updatedType;
    this.view.updateCompetitionTypes(this.competitionTypes);
  }
}

export default CompetitionTypePresenter;
  
  
  