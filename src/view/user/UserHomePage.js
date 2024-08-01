import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { scale } from '../../components/scale';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

import DisplayFitnessStatisticsPresenter from '../../presenter/DisplayFitnessStatisticsPresenter';

const UserHomePage = ({ navigation, route }) => {
    // Get the user from the route params
    const { user } = route.params;

    const [bmi, setBMI] = useState(0);

    const getBMI = () => {
        try{
            new DisplayFitnessStatisticsPresenter({updateBMI: setBMI}).calculateBMI(user);
        }catch(error){
            console.log(error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            getBMI();
        }, [])
    );


    return (
        <ScrollView style={styles.pageContainer}>
            <View style = {styles.titleView}>
                <Text style = {styles.homeTitle}>Welcome Back,</Text>
                <Text style = {styles.homeSubTitle}>{user.fullName ? user.fullName : 'User Name'}</Text>
            </View>
            
            <View style={styles.todayStatsView}>
                <View style = {styles.topStatsView}>
                    <View style = {styles.statsView}>
                        <View style = {styles.statsView2}>
                            <Image source={require('../../../assets/steps_icon.png')} style = {styles.statsIcon} />
                            <Text style = {styles.numText}>0000</Text>
                            <Text>steps</Text>
                        </View>
                        <View style = {styles.statsView2}>
                            <Image source={require('../../../assets/location_icon.png')} style = {styles.statsIcon} />
                            <Text style = {styles.numText}>00.00</Text>
                            <Text>km</Text>
                        </View>
                        <View style = {styles.statsView2}>
                            <Image source={require('../../../assets/fire_color_icon.png')} style = {styles.statsIcon} />
                            <Text style = {styles.numText}>00.00</Text>
                            <Text>kcal</Text>
                        </View>
                    </View>

                    <View style = {styles.bmiView}>
                        <Text style = {styles.bmiTitleText}>BMI</Text>
                        <Text style = {styles.bmiResultText}>{bmi.toFixed(2)}</Text>
                    </View>
                </View>
                <View style = {styles.midStatsView}>
                    <View>

                    </View>
                    <View>

                    </View>
                </View>
                <View style = {styles.midStatsView}>
                    <View>

                    </View>
                    <View>
                        
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    titleView:{
        backgroundColor: '#C42847',
        paddingHorizontal: scale(20),
        paddingTop: scale(72),
        paddingBottom: scale(16),
    },
    homeTitle:{
        fontSize: scale(24),
        fontFamily: 'Poppins',
        color: 'white'
    },
    homeSubTitle:{
        fontSize: scale(32),
        fontFamily: 'Poppins-SemiBold',
        color: 'white'
    },
    todayStatsView:{
        padding: scale(16),
    },
    topStatsView:{
        backgroundColor: 'white',
        height: scale(150),
        borderRadius: scale(16),
        padding: scale(16),
        justifyContent: 'space-between',
        
        flexDirection: 'row',
        
        
        
    },
    midStatsView:{
        backgroundColor: 'green',
        flexDirection: 'row',
    },
    statsView:{
        flexDirection: 'column',
        gap: scale(16),
        width: '50%',
        
    },
    statsIcon:{
        width: scale(24),
        height: scale(24),
    },
    statsView2:{
        flexDirection: 'row',
        gap: scale(8),
        alignItems: 'center',
    },
    numText:{
        fontSize: scale(16),
        fontFamily: 'Inter-SemiBold',
    },
    bmiView:{
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(8),
    },
    bmiTitleText:{
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',
    },
    bmiResultText:{
        fontSize: scale(32),
        fontFamily: 'Inter',
    }
    
    
    
});

export default UserHomePage;

/*

import { isStepCountingSupported, startStepCounterUpdate, stopStepCounterUpdate } from '@uguratakan/react-native-step-counter';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';

setUpdateIntervalForType(SensorTypes.accelerometer, 1500); // 100ms
const [steps, setSteps] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [lastTime, setLastTime] = useState(Date.now());
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0, z: 0 });
    const [lastMagnitude, setLastMagnitude] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);

    // User's weight in kg
    const userWeight = user.weight; 
    const stepLength = 0.75;

    useEffect(() => {
        const subscription = accelerometer
        .pipe(
            map(({ x, y, z }) => {
                const currentTime = Date.now();
                const timeDifference = (currentTime - lastTime) / 1000; // Convert to seconds

                // Calculate distance in meters
                const testDistance = Math.sqrt(
                    Math.pow(x - lastPosition.x, 2) +
                    Math.pow(y - lastPosition.y, 2) +
                    Math.pow(z - lastPosition.z, 2)
                );

                // only detect running and walking, not riding a vehicle
                const distance = testDistance < stepLength || lastMagnitude === 0 ? 0 : testDistance;
                const distanceKm = distance < 0.10 ? 0 : distance / 1000; // Convert to kilometers
                setTotalDistance((prevDistance) => prevDistance + distance);



                const testCurrentSpeed = (distance / timeDifference) * 3.6; // Convert m/s to km/h
                const currentSpeed = testCurrentSpeed < 0.1  || testCurrentSpeed > 50 ? 0 : testCurrentSpeed;
                setSpeed(currentSpeed);


                

                // Calculate calories burned
                const cb = distanceKm * userWeight * 1.036;
            
                setCaloriesBurned(caloriesBurned + cb);
                

                // Update last position and time
                setLastPosition({ x, y, z });
                setLastTime(currentTime);

                // Calculate acceleration magnitude
                const magnitude = Math.sqrt(x * x + y * y + z * z);

                // Calculate magnitude delta
                const magnitudeDelta = Math.abs(magnitude - lastMagnitude);
                setLastMagnitude(magnitude);
                
                // Threshold for detecting a step (this value may need tuning)
                const stepThreshold = 1.5;

                if (magnitudeDelta > stepThreshold && lastMagnitude!==0) {
                    
                    setSteps((prevSteps) => prevSteps + 1);
                }

                return { x, y, z };
            })
        )
        .subscribe();

        return () => {
        subscription.unsubscribe();
        };
    }, [lastPosition, lastTime]);

*/