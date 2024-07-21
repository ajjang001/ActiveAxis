
class WorkoutRoutine{
    _routineID;
    _fitnessPlanID;
    _dayNumber;
    _exercisesList;
    _estCaloriesBurned;
    _isRestDay;

    get routineID(){ return this._routineID; }
    get fitnessPlanID(){ return this._fitnessPlanID; }
    get dayNumber(){ return this._dayNumber; }
    get exercisesList(){ return this._exercisesList; }
    get estCaloriesBurned(){ return this._estCaloriesBurned; }
    get isRestDay(){ return this._isRestDay; }

    set routineID(routineID){ this._routineID = routineID; }
    set fitnessPlanID(fitnessPlanID){ this._fitnessPlanID = fitnessPlanID; }
    set dayNumber(dayNumber){ this._dayNumber = dayNumber; }
    set exercisesList(exercisesList){ this._exercisesList = exercisesList; }
    set estCaloriesBurned(estCaloriesBurned){ this._estCaloriesBurned = estCaloriesBurned; }
    set isRestDay(isRestDay){ this._isRestDay = isRestDay; }

    constructor(){
        this._routineID = '';
        this._fitnessPlanID = '';
        this._dayNumber = 0;
        this._exercisesList = [];
        this._estCaloriesBurned = 0;
        this._isRestDay = false;
    }

    // Custom clone method for deep copying
    clone() {
        const clone = new WorkoutRoutine();
        clone.routineID = this.routineID;
        clone.fitnessPlanID = this.fitnessPlanID;
        clone.dayNumber = this.dayNumber;
        clone.exercisesList = this.exercisesList.map(exercise => ({duration: exercise.duration, repetition:exercise.repetition, exercise: exercise.exercise.clone()}));
        clone.estCaloriesBurned = this.estCaloriesBurned;
        clone.isRestDay = this.isRestDay;
        return clone;
    }

    addExerciseToList(alarmString, exercise, repetition){
        this._exercisesList.push({duration: alarmString, repetition, exercise});
    }

    
}

export default WorkoutRoutine;