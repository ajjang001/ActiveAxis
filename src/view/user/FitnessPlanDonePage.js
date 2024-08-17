import React, {useState, useEffect, useCallback, useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Button, Alert, Touchable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { scale } from '../../components/scale';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import ShareFitnessPlanCompletionPresenter from '../../presenter/ShareFitnessPlanCompletionPresenter';
import WriteExerciseResultPresenter from '../../presenter/WriteExerciseResultPresenter';

const FitnessPlanDonePage = ({navigation, route}) => {
    const {user, fitnessPlan, routine} = route.params;

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

    const handleShare = async() => {
        try{
            await new ShareFitnessPlanCompletionPresenter().shareDayPlanCompletion(fitnessPlan.fitnessPlanName, routine.dayNumber);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    }

    const handleDone = async() => {
        try{
            changeLoadingVisible(true);
            await new WriteExerciseResultPresenter().writeExerciseResult(routine.estCaloriesBurned, user.accountID, routine.routineID, routine.dayNumber);
            navigation.pop(2);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    return(
        <View style = {styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            <ScrollView>
                <View style={styles.imagePlaceholder}>
                    <Image source={{uri:fitnessPlan.fitnessPlanPicture}} style={{width: '100%', height: '100%'}} />
                </View>
            

                <Text style ={styles.header}>Exercise Completed</Text>
                

                <Text style ={styles.congratulationText}>{`Well done, you have completed:`}</Text>
                <Text style = {styles.fitnessPlanText}>
                    {`${fitnessPlan.fitnessPlanName} - Day ${routine.dayNumber}\n`}
                </Text>
                
                <View style = {styles.statsView}>
                    <Text style ={styles.statsTitle}>Calories Burned:</Text>
                    <Text style = {styles.statsContent}>
                        {`${parseInt(routine.estCaloriesBurned).toFixed(0)} kcal`}
                    </Text>
                    <Text style ={styles.statsTitle}>Exercises Completed:</Text>
                    <Text style = {styles.statsContent}>
                        {`${routine.exercisesList.length} exercises`}
                    </Text>
                    <Text style ={styles.statsTitle}>Sets Completed:</Text>
                    <Text style = {styles.statsContent}>
                        {`${routine.exercisesList.reduce((acc, exercise)=>acc+exercise.sets, 0) } sets`}
                    </Text>

                </View>

                
                
            </ScrollView>
            <View style = {styles.buttonsView}>
                <TouchableOpacity onPress={handleDone} style = {styles.button}>
                    <Text style = {styles.buttonText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button} onPress={handleShare}>
                    <Text style = {styles.buttonText}>Share</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    topView:{
        backgroundColor: '#E28413',
        paddingTop: scale(120),
    },
    header:{
        fontSize: scale(32),
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        paddingVertical: scale(16),
        
    },
    imagePlaceholder: {
        width: '100%',
        height: scale(240),
        justifyContent: 'center',
        alignItems: 'center',
    },
    congratulationText:{
        paddingHorizontal: scale(16),
        fontSize: scale(16),
        fontFamily: 'Inter',
    },
    fitnessPlanText:{
        paddingHorizontal: scale(16),
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',

    },
    statsView:{
        backgroundColor:'white',
        marginHorizontal: scale(16),
        padding: scale(16),
        borderRadius: scale(16),

        
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.125,
        shadowRadius: 1,
        elevation: 1,
    },
    statsTitle:{
        fontSize: scale(16),
        fontFamily: 'Inter-SemiBold',
        marginBottom: scale(8),
    },
    statsContent:{
        fontSize: scale(32),
        fontFamily: 'Inter',
        marginBottom: scale(32),
        textAlign: 'center',
    },
    buttonsView:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: scale(16),
        paddingBottom: scale(64),
    },
    button:{
        backgroundColor: '#E28413',
        width: scale(140),
        paddingVertical: scale(8),
        borderRadius: scale(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText:{
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(18),
        
    }
});

export default FitnessPlanDonePage;