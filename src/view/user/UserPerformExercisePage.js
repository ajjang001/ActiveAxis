import React, {useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal, Alert, ScrollView, BackHandler } from 'react-native';
import { scale } from "../../components/scale";
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';
import { Dropdown } from 'react-native-element-dropdown';
import moment from 'moment-timezone';
import { useFocusEffect } from '@react-navigation/native';
import YoutubePlayer from "react-native-youtube-iframe";
import SoundPlayer from 'react-native-sound-player'

const UserPerformExercisePage = ({navigation, route}) => {
    const {user} = route.params;
    const {fitnessPlan} = route.params;
    const {planAllocation} = route.params;
    const {session} = route.params;
    const {routine} = route.params;




    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [status, setStatus] = useState('Rest');
    const [isPaused, setIsPaused] = useState(false);
    const [isDone , setIsDone] = useState(false);
    const [countdown, setCountdown] = useState(user.restInterval || 30);

    const [currentExercise, setCurrentExercise] = useState(routine.exercisesList[currentExerciseIndex]);

    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');


    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }
    

    const convertToSeconds = (timeString) => {
        const time = timeString.split(':');
        return parseInt(time[0]) * 60 + parseInt(time[1]);
    }

    const convertToString = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;


        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    

    const handleCountdownFinish = () => {
        console.log('here countdown finish');
        try{
            if (status === 'Rest') {
                // when previous was resting time
                // next countdown for prep the next exercise
                console.log('==> here is resting - countdown finish');
                setStatus("Get Ready!");
                setCountdown(3);
                SoundPlayer.playAsset(require('../../../assets/sfx/321.mp3'));
            }
            else if (status === "Get Ready!") {
                // when previous was prep time
                // next countdown for exercise time
                console.log('==> here is prep - countdown finish');
                setStatus("Let's Exercise!");
                setCountdown(parseInt(convertToSeconds(currentExercise.duration)));
                SoundPlayer.playAsset(require('../../../assets/sfx/whistle.mp3'));
            }else if (status === "Let's Exercise!") {
                // when previous was exercise time
                // and countdown is finished
                console.log('==> here is exercise - countdown finish');
                SoundPlayer.playAsset(require('../../../assets/sfx/bell.mp3'));
                handleSetComplete();
            }
        }catch(error){
            console.log(error);
        }
    }

    const handleSetComplete = () => {
        console.log('here set complete');

        if (currentSet < currentExercise.sets) {
            console.log('==> here set complete - current set < current exercise sets');
            setCurrentSet(currentSet + 1);
            setCountdown(user.restInterval); // Rest interval
            setStatus('Rest');
        } else if (currentExerciseIndex < routine.exercisesList.length - 1) {
            console.log('==> here set complete - current exercise index < routine exercises list length - 1');
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setCurrentSet(1);
            setCountdown(user.restInterval); // Rest interval
            setStatus('Rest');
        } else {
            setIsDone(true);
            // Alert.alert(`${fitnessPlan.fitnessPlanName} - Day ${routine.dayNumber}`, `Congratulations, you have completed the exercise!\nYou can come back to this exercise routine again.`, [
            //     {
            //         text: 'OK',
            //         onPress: () => navigation.goBack(),
            //     },
            // ]);
            navigation.navigate('FitnessPlanDonePage', {user, fitnessPlan, routine});
            console.log('DONE');
        }         
        
        

      };

    const handleInfoRedirect = () => {
        setIsPaused(true);
        navigation.navigate('ExerciseInstructionPage', {exercise:currentExercise});
    }

    useEffect(()=>{

        if(!isDone){
            const interval = setInterval(() => {
                if (!isPaused) {
                    if (countdown > 0) {
                        setCountdown(countdown - 1);
                    } else {
                        handleCountdownFinish();
                    }
                }
            }, 1000);
    
            return () => clearInterval(interval);
        }
        

    }, [countdown, isPaused, isDone]);

    useEffect(()=>{
        setCurrentExercise(routine.exercisesList[currentExerciseIndex]);
    }, [currentExerciseIndex]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                return true;  
            };
    
            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
            return () => backHandler.remove();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            setIsPaused(false);

        }, [])
    );

    return (
        <View style={styles.container}>
            <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={() => changeConfirmVisible(false)}>
                <ActionDialog
                    message={confirmMessage}
                    changeModalVisible={changeConfirmVisible}
                    action={()=>{navigation.goBack()}}
                />
            </Modal>
            <View style = {styles.backButtonView}>
                <TouchableOpacity style = {styles.backButton} onPress = {()=>{changeConfirmVisible(true, "Once you quit this exercise, you will need to start from the beginning of today's exercise routine.\n\n Are you sure you want to quit?")}}>
                    <Text style = {styles.quitButtonText}>Quit</Text>
                </TouchableOpacity>
            </View>
            <View style = {[styles.topContainer, status === "Rest" ? {backgroundColor:'#C42847'} : (status === "Get Ready!" ? {backgroundColor:'#E28413'} : {backgroundColor:'#00AD3B'}) ]}>
                <Text style = {styles.topContainerText}>{status}</Text>
            </View>
            <View style = {styles.screenView}>
                {
                    currentExercise.exercise.youtubeLink !== '' ?
                    (
                        <YoutubePlayer
                            height={scale(300)}
                            play={'play'}
                            videoId={currentExercise.exercise.youtubeLink}
                        />
                        ) : null
                }
            </View>
            
            <View style = {styles.bottomView}>
                { status === 'Rest' ? (
                    <>
                        <Text style={styles.restText}>Rest Interval</Text>
                        <Text style = {[styles.nextText, {fontFamily:'Poppins-SemiBold'}]}>Next:</Text>
                        
                        <TouchableOpacity onPress={handleInfoRedirect} style = {{flexDirection:'row', justifyContent:'center', gap:scale(8)}}>
                            <Text style = {[styles.nextText, {fontFamily:'Poppins', fontSize:scale(24)}]}>
                                {`${currentExercise.exercise.exerciseName.toUpperCase()}`}
                            </Text>
                            <Image source = {require('../../../assets/info_logo_color.png')} style = {{width:scale(28), height:scale(28), alignSelf:'center'}}/>
                        </TouchableOpacity>
                        <Text style = {[styles.nextText, {fontFamily:'Poppins', color:"#6e6e6e", fontSize:scale(24), height:scale(120)}]}>
                            {`(Set ${currentSet} of ${currentExercise.sets})`}
                        </Text>
                    </>
                ) : (
                    <>
                        <Text style={[styles.exerciseText, status === "Get Ready!" ? {color:'#E28413'} : {color:'#00AD3B'}]}>{status === "Get Ready!" ? 'Ready To Go!' : 'Exercise!'}</Text>
                        <Text style = {[styles.nextText, {fontFamily:'Poppins-SemiBold'}]}> </Text>
                        
                        <TouchableOpacity disabled = {status === "Get Ready!"}  onPress={handleInfoRedirect}  style = {{flexDirection:'row', justifyContent:'center', gap:scale(8)}}>
                            <Text style = {[styles.nextText, {fontFamily:'Poppins', fontSize:scale(24)}]}>
                                {`${currentExercise.exercise.exerciseName.toUpperCase()}`}
                            </Text>
                            <Image source = {require('../../../assets/info_logo_color.png')} style = {{width:scale(28), height:scale(28), alignSelf:'center'}}/>
                        </TouchableOpacity>
                        
                        <Text style = {[styles.nextText, {fontFamily:'Poppins', color:"#6e6e6e", fontSize:scale(24), height:scale(120)}]}>
                            {`(Set ${currentSet} of ${currentExercise.sets})`}
                        </Text>
                    </>
                )}

                <Text style={styles.timerText}>{convertToString(countdown)}</Text>

                <View style = {styles.pauseButtonView}>
                {
                    status !== 'Get Ready!' ?
                    <TouchableOpacity style={styles.pauseButton} onPress = {()=>setIsPaused(!isPaused)}>
                        <Text style = {styles.pauseButtonText}>{isPaused ? 'Continue' : 'Pause'}</Text>
                    </TouchableOpacity>
                    : null
                }
                    
                </View>
            </View>
        </View>
      );



}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FBF5F3',
    },
    backButtonView:{
        width:'100%',
        backgroundColor: '#FBF5F3',
        padding: scale(16),
        paddingTop: scale(48),
        justifyContent: 'center',
        alignItems: 'flex-start',
    
    },
    backButton:{
        backgroundColor: 'black',
        borderRadius: scale(32),
    },
    quitButtonText:{
        color: 'white',
        padding: scale(4),
        paddingHorizontal: scale(32),
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
    },
    topContainer:{
        width:'100%',
        height: scale(96),
        justifyContent: 'center',
        alignItems: 'center',
    },
    topContainerText:{
        fontSize: scale(32),
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
    },
    screenView:{
        height: scale(275),
        width: '100%',
        marginBottom: scale(16),
    },
    bottomView:{
    },
    timerText: {
      fontSize: scale(48),
      textAlign: 'center',
      height: scale(125),
    },
    restText: {
      fontSize: scale(24),
      fontFamily: 'Poppins-SemiBold',
      color: 'red',
      textAlign: 'center',
      height: scale(60),
    },
    nextText:{
        fontSize: scale(18),
        color: 'black',
        textAlign: 'center',
    },
    exerciseText: {
      fontSize: scale(24),
      color: 'green',
      textAlign: 'center',
      fontFamily: 'Poppins-SemiBold',
      height: scale(60),
    },
    pauseButtonView:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    pauseButton:{
        backgroundColor: 'blue',
        width: '55%',
        paddingVertical: scale(8),
        borderRadius: scale(32),
    },
    pauseButtonText:{
        color: 'white',
        fontSize: scale(32),
        textAlign: 'center',
    }
  });

export default UserPerformExercisePage;