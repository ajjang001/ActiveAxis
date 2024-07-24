import React, {useState, useEffect, useRef} from 'react';
import { TimerPickerModal } from "react-native-timer-picker";
import {Text, View, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Modal} from 'react-native';
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";
import { scale } from '../../components/scale';
import YoutubePlayer from "react-native-youtube-iframe";

import CreateFitnessPlanPresenter from '../../presenter/CreateFitnessPlanPresenter';


const SelectExerciseDetailsPage = ({route, navigation}) =>{
    const {exercise, routineIndex, routines, planInfo } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    const [showPicker, setShowPicker] = useState(false);
    const [alarmString, setAlarmString] = useState('');
    const [sets, setSets] = useState(1);


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

    const handleAdd = ()=>{
        try{
            changeLoadingVisible(true);
            new CreateFitnessPlanPresenter({routineIndex: routineIndex, routines: routines}).addExerciseToList(alarmString, exercise, parseInt(sets));
        
            navigation.navigate('CoachCreateFitnessPlanPage2', {
                refresh:true,
                coach: planInfo.coach,
                photo: planInfo.photo,
                goalType: planInfo.goalType,
                details: planInfo.details,
                name: planInfo.name,
                medicalCheck: planInfo.medicalCheck,
                routines: routines
            });
            
        }catch(error){
            changeModalVisible(true, error.message.replace(/^Error:\s*/, ''));
        }finally{
            changeLoadingVisible(false);
        }
        
    }

    const getVideo = async ()=>{
        try{
            changeLoadingVisible(true);
            await new CreateFitnessPlanPresenter({exercise: exercise}).setVideo();
            
        }catch(error){
            changeModalVisible(true, error.message.replace(/^Error:\s*/, ''));
        }finally{
            changeLoadingVisible(false);
        }
    };

    const formatTime = ({minutes, seconds}) => {
        const timeParts = [];
    
        
        if (minutes !== undefined) {
            timeParts.push(minutes.toString().padStart(2, "0"));
        }
        if (seconds !== undefined) {
            timeParts.push(seconds.toString().padStart(2, "0"));
        }

        

        return timeParts.join(":");
    };

    useEffect(()=>{
        if(exercise.youtubeLink === ''){
            // Load Video if not set
            // to avoid multiple request
            getVideo();
        }
    },[]);

    return(
        <View style = {styles.container}>
            <Text style = {styles.exerciseNameText}>{exercise.exerciseName.toUpperCase()}</Text>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            
            <ScrollView style = {{padding: scale(10)}}>
                <View style = {styles.screenView}>
                    {
                        exercise.youtubeLink !== '' ?
                        (
                            <YoutubePlayer
                                height={scale(300)}
                                play={'play'}
                                videoId={exercise.youtubeLink}
                            />
                            ) : null
                    }
                </View>
                
                <Text style = {styles.textTitle}>EXERCISE TYPE</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.exerciseType)}</Text>
                <Text style = {styles.textTitle}>TARGET MUSCLE</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.muscle)}</Text>
                <Text style = {styles.textTitle}>EQUIPMENT</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.equipment)}</Text>
                <Text style = {styles.textTitle}>DIFFICULTY</Text>
                <Text style = {styles.textContent}>{modifyText(exercise.difficulty)}</Text>
                <Text style = {styles.textTitle}>INSTRUCTIONS</Text>
                <Text style = {styles.textContent}>{exercise.instructions}</Text>
                <Text style = {styles.textTitle}>DURATION</Text>
                <TouchableOpacity style ={styles.setDurationButton} activeOpacity={0.7} onPress={() => setShowPicker(true)}>
                    <Text style={styles.setDurationButtonText}>
                        {alarmString || "Set Duration Here"}
                    </Text>
                    
                </TouchableOpacity>
                <Text style = {styles.textSubTitle}>*Note: 1 rep is equivalent to 2 seconds</Text>

                <Text style = {styles.textTitle}>SETS</Text>
                <TextInput
                    style = {styles.setSetsTextField}
                    placeholder = 'Enter sets'
                    keyboardType = 'numeric'
                    value = {sets.toString()}
                    onChangeText = {(text)=>setSets(text)}
                />
                

                <TouchableOpacity style = {styles.addButton} onPress = {handleAdd}>
                    <Text style = {styles.addButtonText}>ADD EXERCISE</Text>
                </TouchableOpacity>

                <TimerPickerModal
                    hideHours
                    visible={showPicker}
                    setIsVisible={setShowPicker}
                    onConfirm={(pickedDuration) => {
                        setAlarmString(formatTime(pickedDuration));
                        setShowPicker(false);
                    }}
                    modalTitle="Set Duration"
                    onCancel={() => setShowPicker(false)}
                    closeOnOverlayPress
                    styles={{
                        theme: "dark",
                    }}
                    modalProps={{
                        overlayOpacity: 0.2,
                    }}
                />
                

                
            </ScrollView>
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FBF5F3',
        
    },
    screenView:{
        height: scale(275),
        width: '100%',
        marginBottom: scale(16),
    },
    exerciseNameText:{
        fontSize: scale(30),
        fontWeight: 'bold',
        textAlign: 'center',
        padding: scale(16),
        backgroundColor: '#E28413',
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
    setDurationButton:{
        marginBottom: scale(10),
    },
    setDurationButtonText:{
        width: "50%",
        paddingVertical: scale(10),
        paddingHorizontal: scale(18),
        borderWidth: 1,
        borderRadius: scale(10),
        fontSize: scale(16),
        overflow: "hidden",
        borderColor: "#C2C2C2",
        color: "gray"
    },
    setSetsTextField:{
        width: '50%',
        padding: scale(10),
        borderWidth: 1,
        borderRadius: scale(10),
        borderColor: '#C2C2C2',
        marginBottom: scale(36),
        fontSize: scale(16),
    },
    addButton:{
        backgroundColor: '#E28413',
        padding: scale(10),
        borderRadius: scale(10),
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: scale(75),
    },
    addButtonText:{
        fontSize: scale(16),
        fontFamily: 'Inter-SemiBold',
        color: 'white',

    }
})

export default SelectExerciseDetailsPage;