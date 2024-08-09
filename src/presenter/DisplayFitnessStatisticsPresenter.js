import { Platform } from 'react-native';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment-timezone';

class DisplayFitnessStatisticsPresenter {
  constructor(view) {
    this.view = view;
  }

  calculateBMI(user){
    try{
        const weight = user.weight;
        const height = user.height/100;
        const bmi = weight / (height * height);
        this.view.updateBMI(bmi);

        if(bmi < 18.5){
            this.view.updateBMIColor('#ffe189');
            this.view.updateBMICategory('Underweight');
            this.view.updateBMIAdvice('You are at risk of nutritional deficiency disease and osteoporosis. Seek medical advice if needed and have a balanced meal.');
        }else if(bmi >= 18.5 && bmi < 23){
            this.view.updateBMIColor('#8cd47e');
            this.view.updateBMICategory('Normal');
            this.view.updateBMIAdvice('You are in good shape! Keep up the good work and maintain a balanced diet and regular exercise');
        }else if(bmi >= 23 && bmi < 30){
            this.view.updateBMIColor('#ffb54c');
            this.view.updateBMICategory('Overweight');
            this.view.updateBMIAdvice('You have moderate risk of health problems!\nReduce your calorie intake and increase physical activities. Please consult a doctor for a diet plan and exercise routine, or consult to our fitness coach for a personalized fitness plans.');
            
        }else{
            this.view.updateBMIColor('#f59d9d');
            this.view.updateBMICategory('Obese');
            this.view.updateBMIAdvice('You are at a high risk of health problems!\nReduce your calorie intake and increase physical activities. Please consult a doctor for a diet plan and exercise routine, or consult to our fitness coach for a personalized fitness plans.');

        }
    }catch(error){
        throw new Error(error);
    }
  }

  async getTodayStatistics(date){
    try{
      const isInitialized = await initialize();
      if (!isInitialized) {
        throw new Error('Failed to initialize Health Connect');
      }else{

        const timeRangeFilter = {
          operator: 'between',
          startTime: new Date(date.setHours(0,0,0,0)).toISOString(),
          endTime: new Date(date.setHours(23,59,59,999)).toISOString(),
        }
        
        // Reading steps record
        const stepsRecords = await readRecords('Steps', { timeRangeFilter });
        this.view.updateSteps(stepsRecords.length === 0 ? 0 : stepsRecords[0].count);

        // Reading distance record
        const distanceRecords = await readRecords('Distance', { timeRangeFilter });
        const totalDistance = distanceRecords.reduce((total, record) => total + record.distance.inKilometers, 0);
        this.view.updateDistance(totalDistance || 0.00);

        // Reading calories burned record
        const caloriesBurnedRecords = await readRecords('TotalCaloriesBurned', { timeRangeFilter });
        const totalCaloriesBurned = caloriesBurnedRecords.reduce((total, record) => total + record.energy.inKilocalories, 0);
        this.view.updateCaloriesBurned(totalCaloriesBurned || 0.00);

        // Reading heart rate record
        const heartRateRecords = await readRecords('HeartRate', { timeRangeFilter });
        


        
        
        let minHeartRate = Infinity;
        let maxHeartRate = -Infinity;

        let avg = 0;
        let totalCountPerHour = 0;

        heartRateRecords.forEach((record) => {
          minHeartRate = record.samples.reduce((min, sample) => Math.min(min, sample.beatsPerMinute), minHeartRate);
          maxHeartRate = record.samples.reduce((max, sample) => Math.max(max, sample.beatsPerMinute), maxHeartRate);
          avg += record.samples.reduce((sum, sample) => sum + sample.beatsPerMinute, 0);
          totalCountPerHour += record.samples.length;
        });

        avg = avg / totalCountPerHour;



      
        if (minHeartRate !== Infinity && maxHeartRate !== -Infinity && avg !== 0) {
          const utcDateTimeString = heartRateRecords[heartRateRecords.length-1].samples[0].time;
          const userTimeZome = RNLocalize.getTimeZone();
          const localDateTimeString = moment.utc(utcDateTimeString).tz(userTimeZome).format('HH:mm');
          this.view.updateReadingTime(localDateTimeString);

          this.view.updateRecentHeartRate(heartRateRecords[heartRateRecords.length-1].samples[0].beatsPerMinute || '--');
          this.view.updateAverageHeartRate(avg.toFixed(0) || '--');
          this.view.updateMinHeartRate(minHeartRate || '--');
          this.view.updateMaxHeartRate(maxHeartRate || '--');
        }else{
          this.view.updateReadingTime('--');
          this.view.updateRecentHeartRate('--');
          this.view.updateAverageHeartRate('--');
          this.view.updateMinHeartRate('--');
          this.view.updateMaxHeartRate('--');
        }



      }


    }catch(error){
        throw new Error(error);
    }
  }
}

export default DisplayFitnessStatisticsPresenter;