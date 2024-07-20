
class WorkoutRoutine{
    _routineID;
    _fitnessPlanID;
    _dayNumber;
    _exercisesList;
    _isRestDay;

    get routineID(){ return this._routineID; }
    get fitnessPlanID(){ return this._fitnessPlanID; }
    get dayNumber(){ return this._dayNumber; }
    get exercisesList(){ return this._exercisesList; }
    get isRestDay(){ return this._isRestDay; }

    set routineID(routineID){ this._routineID = routineID; }
    set fitnessPlanID(fitnessPlanID){ this._fitnessPlanID = fitnessPlanID; }
    set dayNumber(dayNumber){ this._dayNumber = dayNumber; }
    set exercisesList(exercisesList){ this._exercisesList = exercisesList; }
    set isRestDay(isRestDay){ this._isRestDay = isRestDay; }

    constructor(){
        this._routineID = '';
        this._fitnessPlanID = '';
        this._dayNumber = 0;
        this._exercisesList = [];
        this._isRestDay = false;
    }

    // Custom clone method for deep copying
    clone() {
        const clone = new WorkoutRoutine();
        clone.routineID = this.routineID;
        clone.fitnessPlanID = this.fitnessPlanID;
        clone.dayNumber = this.dayNumber;
        clone.exercisesList = this.exercisesList.map(exercise => exercise.clone());
        clone.isRestDay = this.isRestDay;
        return clone;
    }

    addExerciseToList(exercise){
        this._exercisesList.push(exercise);
    }

    
}

export default WorkoutRoutine;