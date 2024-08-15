import { DeviceType } from 'expo-device';
import { insertRecords, RecordingMethod } from 'react-native-health-connect';
import ExerciseHistory from '../model/ExerciseHistory';

class WriteExerciseResultPresenter{
    constructor(view){
        this.view = view;
        this.model = new ExerciseHistory();
    }

    async writeExerciseResult(caloriesKcal, userID, routineID, dayNumber){
        try{
            await insertRecords([
                {
                    recordType: 'TotalCaloriesBurned',
                    energy:{
                        unit:'kilocalories',
                        value: caloriesKcal
                    },
                    startTime: new Date().toISOString(),
                    endTime: new Date(new Date().getTime() + 1000).toISOString(),
                    metadata:{
                        recordingMethod: RecordingMethod.RECORDING_METHOD_AUTOMATICALLY_RECORDED,
                        device:{
                            manufacturer:'ANY',
                            model: 'ANY',
                            type: DeviceType.TYPE_PHONE,
                        }
                    }
                }
            ]);

            await this.model.addExerciseHistory(caloriesKcal, userID, routineID, dayNumber);




            
        }catch(error){
            throw new Error(error);
        }
    }
}

export default WriteExerciseResultPresenter;