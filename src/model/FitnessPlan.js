
class FitnessPlan{
    _fitnessPlanID;
    _coachID;
    _fitnessPlanName;
    _fitnessPlanDescription;
    _planGoal;
    _fitnessPlanPicture;
    _routinesList;
    _lastUpdated;
    

    constructor(){}

    get fitnessPlanID(){ return this._fitnessPlanID; }
    get coachID(){ return this._coachID; }
    get fitnessPlanName(){ return this._fitnessPlanName; }
    get fitnessPlanDescription(){ return this._fitnessPlanDescription; }
    get planGoal(){ return this._planGoal; }
    get fitnessPlanPicture(){ return this._fitnessPlanPicture; }
    get routinesList(){ return this._routinesList; }
    get lastUpdated(){ return this._lastUpdated; }
    
    
    set fitnessPlanID(fitnessPlanID){ this._fitnessPlanID = fitnessPlanID; }
    set coachID(coachID){ this._coachID = coachID; }
    set fitnessPlanName(fitnessPlanName){ this._fitnessPlanName = fitnessPlanName; }
    set fitnessPlanDescription(fitnessPlanDescription){ this._fitnessPlanDescription = fitnessPlanDescription; }
    set planGoal(planGoal){ this._planGoal = planGoal; }
    set fitnessPlanPicture(fitnessPlanPicture){ this._fitnessPlanPicture = fitnessPlanPicture; }
    set routinesList(routinesList){ this._routinesList = routinesList; }
    set lastUpdated(lastUpdated){ this._lastUpdated = lastUpdated; }


    
}

export default FitnessPlan;