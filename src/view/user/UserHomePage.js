import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, ScrollView, Alert, Modal } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';

import { LoadingDialog, MessageDialog } from '../../components/Modal';
import DisplayFitnessStatisticsPresenter from '../../presenter/DisplayFitnessStatisticsPresenter';
import DisplayNotificationPresenter from '../../presenter/DisplayNotificationPresenter';
import DisplayCompetitionProgressPresenter from '../../presenter/DisplayCompetitionProgressPresenter';
import ObtainAchievementPresenter from '../../presenter/ObtainAchievementPresenter';

const UserHomePage = ({ navigation, route }) => {
    // Get the user from the route params
    const { user } = route.params;

    const [bmi, setBMI] = useState(0);
    const [bmiColor , setBMIColor] = useState('#8cd47e');
    const [bmiCategory, setBMICategory] = useState('Normal');
    const [bmiAdvice, setBMIAdvice] = useState('You are in good shape!');

    const [steps, setSteps] = useState(0);
    const [distance, setDistance] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);

    const [readingTime, setReadingTime] = useState('--');
    const [recentHeartRate, setRecentHeartRate] = useState('--');
    const [averageHeartRate, setAverageHeartRate] = useState('--');
    const [minHeartRate, setMinHeartRate] = useState('--');
    const [maxHeartRate, setMaxHeartRate] = useState('--');

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    const getBMI = () => {
        try{
            new DisplayFitnessStatisticsPresenter({updateBMI: setBMI, updateBMIColor: setBMIColor, updateBMICategory: setBMICategory, updateBMIAdvice: setBMIAdvice}).calculateBMI(user);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    }

    const getTodayStatistics = async() => {
        try{
            await new DisplayFitnessStatisticsPresenter({
                updateReadingTime: setReadingTime,
                updateSteps: setSteps, 
                updateDistance: setDistance, 
                updateCaloriesBurned: setCaloriesBurned,
                updateRecentHeartRate: setRecentHeartRate,
                updateAverageHeartRate: setAverageHeartRate,
                updateMinHeartRate: setMinHeartRate,
                updateMaxHeartRate: setMaxHeartRate
            }).getTodayStatistics(new Date());
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    };

    const scheduleNotification = async() => {
        try{
            await new DisplayNotificationPresenter().scheduleNotification(caloriesBurned, user.calorieTarget, steps, user.stepTarget);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    }

    const updateUserCompetitionProgress = async () => {
        try{
            new DisplayCompetitionProgressPresenter().updateUserCompetitionProgress(user.accountID);
        }catch(error){
            throw new Error(error);
        }
    }

    const checkStepsAchievements = async () => {
        try{
            const justObtainedAchievements = await new ObtainAchievementPresenter().checkAchievementSteps(user.accountID, steps);

            if(justObtainedAchievements){
                console.log(justObtainedAchievements);
                if(justObtainedAchievements.length > 0){
                    for(let i = 0; i < justObtainedAchievements.length; i++){
                        Alert.alert('Achievement Unlocked', justObtainedAchievements[i]);
                        console.log(`Achievement Unlocked: ${justObtainedAchievements[i]}`);
                    }
                }
            }
        }catch(error){
            console.log(error);
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    }

    const loadInfo = () => {
        try{
            changeLoadingVisible(true);
            getBMI();
            getTodayStatistics();
            scheduleNotification();
            updateUserCompetitionProgress();
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }
    

    useFocusEffect(
        useCallback(() => {
            loadInfo();
        }, [])
    );

    useEffect(() => {
        if(steps > 0){
            checkStepsAchievements();
        }
    }, [steps]);
    


    return (
        <ScrollView style={styles.pageContainer}>
            <View style = {styles.titleView}>
                <Text style = {styles.homeTitle}>Welcome Back,</Text>
                <Text style = {styles.homeSubTitle}>{user.fullName ? user.fullName : 'User Name'}</Text>
            </View>

            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            
            <View style={styles.todayStatsView}>
                <View style = {styles.topStatsView}>
                    <View style = {styles.statsView}>
                        <View style = {styles.statsView2}>
                            <Image source={require('../../../assets/steps_icon.png')} style = {styles.statsIcon} />
                            <Text style = {styles.numText}>{steps}</Text>
                            <Text>steps</Text>
                        </View>
                        <View style = {styles.statsView2}>
                            <Image source={require('../../../assets/location_icon.png')} style = {styles.statsIcon} />
                            <Text style = {styles.numText}>{distance.toFixed(2)}</Text>
                            <Text>km</Text>
                        </View>
                        <View style = {styles.statsView2}>
                            <Image source={require('../../../assets/fire_color_icon.png')} style = {styles.statsIcon} />
                            <Text style = {styles.numText}>{caloriesBurned.toFixed(0)}</Text>
                            <Text>kcal</Text>
                        </View>
                    </View>

                    <View style = {styles.bmiView}>
                        <View style = {[styles.bmiCircle, {backgroundColor: bmiColor}]}>
                            <Text style = {styles.bmiTitleText}>BMI</Text>
                            <Text style = {styles.bmiResultText}>{bmi.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>

                <View style = {styles.adviceView}>
                    <Text style = {styles.adviceText}>{bmiAdvice}</Text>
                </View>

                <View style = {styles.midStatsView}>
                    <View style = {styles.subContentStatsView}>
                        <View>
                            <Text style={styles.subContentTitleText}>Steps</Text>
                        </View>
                        <View style = {styles.statsView3}>
                            <View style = {{flexDirection:'row', gap:scale(8), alignItems:'center'}}>
                                <Image source={require('../../../assets/steps_icon.png')} style = {styles.statsIcon2} />
                                <Text style = {styles.numText2}>{steps}</Text>
                            </View>
                            <Text style = {styles.midSubText}>/ {user.stepTarget} steps</Text>    
                        </View>
                    </View>

                    <View style = {styles.subContentStatsView}>
                        <Text style={styles.subContentTitleText}>Distance</Text>
                        <View style = {styles.statsView3}>
                            <View style = {{flexDirection:'row', gap:scale(8), alignItems:'center'}}>
                                <Image source={require('../../../assets/location_icon.png')} style = {styles.statsIcon2} />
                                <Text style = {styles.numText2}>{distance.toFixed(2)}</Text>
                            </View>
                            <Text style = {styles.midSubText}>km</Text>    
                        </View>
                    </View>
                    
                </View>

                <View style = {styles.midStatsView}>
                    <View style = {styles.subContentStatsView}>
                        <Text style={styles.subContentTitleText}>Calories Burned</Text>
                        <View style = {styles.statsView3}>
                            <View style = {{flexDirection:'row', gap:scale(8), alignItems:'center'}}>
                                <Image source={require('../../../assets/fire_color_icon.png')} style = {styles.statsIcon2} />
                                <Text style = {styles.numText2}>{caloriesBurned.toFixed(0)}</Text>
                            </View>
                            <Text style = {styles.midSubText}>/ {user.calorieTarget} kcal</Text>    
                        </View>
                    </View>
                    
                    <View style = {styles.subContentStatsView}>
                        <Text style={styles.subContentTitleText}>Body Mass Index</Text>
                        <View style = {styles.statsView3}>
                                <Text style = {styles.bmiResultText}>{bmi.toFixed(1)}</Text>
                                <Text style = {styles.midSubText}>{bmiCategory}</Text>
                        </View>
                        
                    </View>
                </View>

                <View style = {styles.midStatsView}>
                    <View style = {styles.subContentStatsView}>
                        <Text style={styles.subContentTitleText}>Heart Rate</Text>
                        <View style = {styles.statsView3}>
                            <View style = {{flexDirection:'row', gap:scale(8), alignItems:'center'}}>
                                <Image source={require('../../../assets/heart_rate_icon.png')} style = {styles.statsIcon2} />
                                <Text style = {styles.numText2}>{recentHeartRate} bpm</Text>
                            </View>
                            <Text style = {styles.midSubText}>Latest {readingTime}</Text>
                        </View>
                    </View>
                    <View style = {styles.subContentStatsView}>
                        <Text style={styles.subContentTitleText}>Min/Max Heart Rate</Text>
                        <View style = {styles.statsView3}>
                            <Text style={[styles.avgMinMaxText, {fontWeight:'bold'}]}>Avg:</Text>
                            <Text style={styles.avgMinMaxText}>{averageHeartRate} bpm</Text>
                            <Text style={[styles.avgMinMaxText, {fontWeight:'bold'}]}>Min/Max:</Text>
                            <Text style={styles.avgMinMaxText}>{minHeartRate} bpm / {maxHeartRate} bpm</Text>
                        </View>
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
    adviceView:{
        backgroundColor: 'white',
        borderRadius: scale(16), 
        padding: scale(28),
        marginBottom: scale(16),
        justifyContent: 'center',
        

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    adviceText:{
        fontSize: scale(16),
        fontFamily: 'Inter',
    },
    topStatsView:{
        backgroundColor: 'white',
        borderRadius: scale(16),
        paddingVertical: scale(16),
        paddingLeft: scale(32),
        justifyContent: 'space-between',        
        flexDirection: 'row',
        marginBottom: scale(16),
        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        
        
    },
    
    statsView:{
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        width: '50%',
        
    },
    statsIcon:{
        width: scale(24),
        height: scale(24),
    },
    statsIcon2:{
        width: scale(32),
        height: scale(32),
    },
    statsView2:{
        flexDirection: 'row',
        gap: scale(8),
        alignItems: 'center',
    },
    statsView3:{
        paddingVertical: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    numText:{
        fontSize: scale(16),
        fontFamily: 'Inter-SemiBold',
    },
    numText2:{
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',
    },
    midSubText:{
        fontSize: scale(16),
        fontFamily: 'Inter',
    },
    bmiView:{
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(8),
    },
    bmiCircle:{
        justifyContent: 'center',
        alignItems: 'center',
        width: scale(125),
        height: scale(125),
        borderRadius: scale(125/2),
    },
    bmiTitleText:{
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',
    },
    bmiResultText:{
        fontSize: scale(32),
        fontFamily: 'Inter',
    },
    midStatsView:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    subContentStatsView: {
        backgroundColor: 'white',
        padding: scale(16),
        borderRadius: scale(16),
        width: '45%',
        marginVertical: scale(8),

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        
    },
    subContentTitleText:{
        fontSize: scale(16),
        fontFamily: 'Inter-SemiBold',
    },
    avgMinMaxText:{
        fontSize: scale(16),
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