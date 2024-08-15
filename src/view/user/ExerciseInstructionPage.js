import React, {useState, useEffect, useRef} from 'react';
import { TimerPickerModal } from "react-native-timer-picker";
import {Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Modal} from 'react-native';
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";
import { scale } from '../../components/scale';
import YoutubePlayer from "react-native-youtube-iframe";


const ExerciseInstructionPage = ({navigation, route}) => {
    const {exercise} = route.params;
    
    
    
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }
    
    const modifyText = (text)=>{
        text = text.replace(/_/g, ' ');
        const words = text.split(' ');

        if (words.length > 1){
            return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }else{
            return text.charAt(0).toUpperCase() + text.slice(1);
        }

    }

    const modifyTime = (timeString)=>{
        // convert 12:34 to 12 minutes and 34 seconds
        // if minutes == 00, then return seconds only
        const time = timeString.split(':');
        if (time[0] === '00'){
            return `${time[1]} seconds`;
            
        }else if (time[1] === '00'){
            return `${time[0]} minutes`;
        } else{
            return `${time[0]} minutes and ${time[1]} seconds`;
        }

    }

    return(
        <View style = {styles.container}>
            <Text style = {styles.exerciseNameText}>{exercise.exercise.exerciseName.toUpperCase()}</Text>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>

            <ScrollView style = {{padding: scale(10)}}>
                <View style = {styles.screenView}>
                    {
                        exercise.exercise.youtubeLink !== '' ?
                        (
                            <YoutubePlayer
                                height={scale(300)}
                                play={'play'}
                                videoId={exercise.exercise.youtubeLink}
                            />
                            ) : null
                    }
                </View>
                <Text style = {styles.textTitle}>EXERCISE TYPE</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.exercise.exerciseType)}</Text>
                <Text style = {styles.textTitle}>TARGET MUSCLE</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.exercise.muscle)}</Text>
                <Text style = {styles.textTitle}>EQUIPMENT</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.exercise.equipment)}</Text>
                <Text style = {styles.textTitle}>DIFFICULTY</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.exercise.difficulty)}</Text>
                <Text style = {styles.textTitle}>INSTRUCTIONS</Text>
                <Text style = {styles.textContent}>{exercise.exercise.instructions}</Text>
                <Text style = {styles.textTitle}>SETS</Text>
                <Text style = {styles.textContent}>{exercise.sets}</Text>
                <Text style = {styles.textTitle}>DURATION PER SET</Text>
                <Text style = {[styles.textContent,{marginBottom:scale(8)}]}>{modifyTime(exercise.duration)}</Text>
                <Text style = {styles.textSubTitle}>*Note: 1 rep is equivalent to 2 seconds</Text>
                
            </ScrollView>

        </View>
    );


}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    exerciseNameText:{
        fontSize: scale(30),
        fontWeight: 'bold',
        textAlign: 'center',
        padding: scale(16),
        backgroundColor: '#E28413',
    },
    screenView:{
        height: scale(275),
        width: '100%',
        marginBottom: scale(16),
    },
    textTitle:{
        fontSize: scale(20),
        fontWeight: 'bold',
        paddingHorizontal: scale(10),
        marginBottom: scale(5),
    },
    textSubTitle:{
        fontSize: scale(14),
        fontFamily:'Inter',
        paddingHorizontal: scale(10),
        marginBottom: scale(36),
    },
    textContent:{
        fontSize: scale(16),
        paddingHorizontal: scale(10),
        marginBottom: scale(36),
        fontFamily: 'Inter',
    },
});

export default ExerciseInstructionPage;