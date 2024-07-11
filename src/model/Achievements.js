
class Achievements{
    _achievementName;
    _exerciseType;
    _description;
    _maxProgress;

    constructor () {}

    get achievementName() {return this._achievementName;}
    get exerciseType() {return this._exerciseType;}
    get description() {return this._description;}
    get maxProgress() {return this._maxProgress;}

    set achievementName(achievementName) {this._achievementName = achievementName;}
    set exerciseType(exerciseType) {this._exerciseType = exerciseType;}
    set description(description) {this._description = description;}
    set maxProgress(maxProgress) {this._maxProgress = maxProgress;}

    
}

export default Achievements;