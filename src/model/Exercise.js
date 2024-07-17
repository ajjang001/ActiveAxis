class Exercise{
    _exerciseID;
    _exerciseName;
    _exerciseType;
    _muscle;
    _equipment;
    _difficulty;
    _instructions;
    constructor(){}

    get exerciseID(){ return this._exerciseID; }
    get exerciseName(){ return this._exerciseName; }
    get exerciseType(){ return this._exerciseType; }
    get muscle(){ return this._muscle; }
    get equipment(){ return this._equipment; }
    get difficulty(){ return this._difficulty; }
    get instructions(){ return this._instructions; }

    set exerciseID(exerciseID){ this._exerciseID = exerciseID; }
    set exerciseName(exerciseName){ this._exerciseName = exerciseName; }
    set exerciseType(exerciseType){ this._exerciseType = exerciseType; }
    set muscle(muscle){ this._muscle = muscle; }
    set equipment(equipment){ this._equipment = equipment; }
    set difficulty(difficulty){ this._difficulty = difficulty; }
    set instructions(instructions){ this._instructions = instructions; }
    

}

export default Exercise;