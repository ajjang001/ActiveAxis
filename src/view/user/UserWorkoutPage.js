import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import AnimatedProgressWheel from 'react-native-progress-wheel';
import DatePicker from 'react-native-date-picker';


import DisplayFitnessStatisticsPresenter from '../../presenter/DisplayFitnessStatisticsPresenter';


import { LoadingDialog, MessageDialog } from '../../components/Modal';



const UserWorkoutPage = ({navigation, route}) => {
    const { user } = route.params;

    const [date, setDate] = useState(new Date());

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

    // Date Picker
    const [open, setOpen] = useState(false)
 

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

    const changeDate = (numDays) =>{
        const currentDate = new Date(date);

        currentDate.setDate(currentDate.getDate() + numDays);
        setDate(currentDate);
    }

    const getStatistics = async() => {
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
            }).getTodayStatistics(date);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    };

    const loadInfo = () => {
        try{
            changeLoadingVisible(true);
            getStatistics();
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const progressionData = {
        labels: ["Steps", "Calories Burned"],
        data: [
            steps / user.stepTarget * 100 > 100 ? 100 : steps / user.stepTarget * 100,
            caloriesBurned / user.calorieTarget * 100 > 100 ? 100 : caloriesBurned / user.calorieTarget* 100
        ],
        colors: ['limegreen', '#ff6600'] 
    };

    

    useFocusEffect(
        useCallback(() => {
            setDate(new Date());
            loadInfo();
        }, [])
    );

    useEffect(() => {
        loadInfo();
    },[date]);

    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <View style = {styles.titleView}>
                <Text style = {styles.titleText}>User Workout</Text>
            </View>
            
            <View style={styles.datePicker}>
                <AntDesign
                    onPress={() => changeDate(-1)}
                    name="left"
                    size={scale(32)}
                    color="black"
                />

                <TouchableOpacity onPress={() => setOpen(true)}>
                    <Text style={styles.date}>{date.toDateString()}</Text>
                </TouchableOpacity>

                <AntDesign
                    onPress={new Date().toDateString() === date.toDateString() ? ()=>{} : () => changeDate(1)}
                    name="right"
                    size={scale(32)}
                    color={new Date().toDateString() === date.toDateString() ? 'grey' : 'black'}
                />
            </View>

            <DatePicker
                modal
                open={open}
                date={date}
                mode='date'
                minimumDate={new Date(2000, 1, 1)}
                maximumDate={new Date()}
                onConfirm={(date) => {
                    setOpen(false);
                    setDate(date);
                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />



            <View style = {styles.statsDateView}>
                <View style = {styles.statsCircleContainer}>
                    <View style = {styles.circlesView}>
                        
                        <View style = {{position:'absolute', backgroundColor:'transparent'}}>
                            <AnimatedProgressWheel
                                size = {scale(150)}
                                width = {scale(12)}
                                rotation={'-90deg'}
                                color = {progressionData.colors[0]}
                                progress = {progressionData.data[0]}
                                backgroundColor = '#e0e0e0'
                                animateFromValue={0}
                                duration = {1000}
                            />
                        </View>

                        <View style = {{position:'absolute', backgroundColor:'transparent'}}>
                            <AnimatedProgressWheel
                                size = {scale(110)}
                                width = {scale(12)}
                                rotation={'-90deg'}
                                color = {progressionData.colors[1]}
                                progress = {progressionData.data[1]}
                                backgroundColor = '#e0e0e0'
                                animateFromValue={0}
                                duration = {1000}
                            />
                        </View>
                    </View>
                    <View style = {styles.statsView}>
                        <View style = {styles.statsItem}>
                            <Text style = {styles.itemTitle}>Steps: </Text>
                            <View style = {styles.statsView2}>
                                <Image source={require('../../../assets/steps_icon.png')} style = {styles.statsIcon} />
                                <Text style = {styles.numText}>{steps}</Text>
                            </View>
                            <Text style = {styles.itemSubTitle}>/ {user.stepTarget} steps</Text>
                        </View>
                        <View style = {styles.statsItem}>
                            <Text style = {styles.itemTitle}>Distance:</Text>
                            <View style = {styles.statsView2}>
                                <Image source={require('../../../assets/location_icon.png')} style = {styles.statsIcon} />
                                <Text style = {styles.numText}>{distance.toFixed(2)}</Text>
                            </View>
                            <Text style = {styles.itemSubTitle}>km</Text>
                        </View>
                        <View style = {styles.statsItem}>
                            <Text style = {styles.itemTitle}>Calories Burned:</Text>
                            <View style = {styles.statsView2}>
                                <Image source={require('../../../assets/fire_color_icon.png')} style = {styles.statsIcon} />
                                <Text style = {styles.numText}>{caloriesBurned.toFixed(0)}</Text>
                            </View>
                            <Text style = {styles.itemSubTitle}>/ {user.calorieTarget} kcal</Text>
                        </View>
                    </View>
                </View>




                <View style = {styles.heartRateContainer}>
                    
                    <Image source={require('../../../assets/heart_rate_icon.png')} style = {styles.heartIcon} />
                    <View style = {styles.heartRate}>
                        <Text style = {styles.heartRateReadTitle}>Avg:</Text>
                        <Text style = {styles.heartRateReadSubtitle}>{averageHeartRate} bpm</Text>
                    </View>
                    <View style = {styles.heartRate}>
                        <Text style = {styles.heartRateReadTitle}>Min:</Text>
                        <Text style = {styles.heartRateReadSubtitle}>{minHeartRate} bpm</Text>
                    </View>
                    <View style = {styles.heartRate}>
                        <Text style = {styles.heartRateReadTitle}>Max:</Text>
                        <Text style = {styles.heartRateReadSubtitle}>{maxHeartRate} bpm</Text>
                    </View>
                    
                </View>
            </View>
        </ScrollView>
    );



};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    titleView:{
        height: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(50),
    },
    titleText:{
        fontSize: scale(32),
        fontFamily: 'Poppins-SemiBold',
    },
    datePicker: {
        alignItems: 'center',
        padding: scale(32),
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scale(26)
    },
    date: {
        color: 'black',
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(20),
        marginHorizontal: scale(20),
    },
    statsDateView:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsCircleContainer:{
        width: '95%',
        height: scale(400),
        borderRadius: scale(20),
        backgroundColor: 'white',
    },
    circlesView:{
        position: 'relative',
        height: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: scale(20),
        marginTop: scale(20),
    },
    statsView:{
        height: '40%',
        marginHorizontal: scale(20),
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    
        
    },
    statsView2:{
        flexDirection: 'row',
        gap: scale(8),
        alignItems: 'center',
        
    },
    statsItem:{
        width: '32.5%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: scale(8),
        
    },
    statsIcon:{
        width: scale(18),
        height: scale(18),
    },
    itemTitle:{
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        
    },
    itemSubTitle:{
        fontFamily: 'Inter',
        fontSize: scale(16),
        color: '#808080',

    },
    numText:{
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',
        
    },
    heartRateContainer:{
        width: '95%',
        height: scale(200),
        borderRadius: scale(20),
        backgroundColor: 'white',
        marginTop: scale(20),
        padding: scale(20),
        paddingHorizontal: scale(32),
        flexDirection: 'row',
        gap: scale(20),
        alignItems: 'center',
    },
    heartRate:{
    },
    heartIcon:{
        height: scale(75),
        width: scale(75),
    },
    heartRateReadTitle:{
        fontSize: scale(18),
        fontFamily: 'Inter-SemiBold',
    },
    heartRateReadSubtitle:{
        fontSize: scale(24),
        fontFamily: 'Inter',
    },
});

export default UserWorkoutPage;