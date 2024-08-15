import React, {useState, useEffect, useCallback, useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Button, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { scale } from '../../components/scale';
import ExerciseCard from '../../components/ExerciseCard';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';


const UserFitnessPlanDetailsPage2 = ({navigation, route}) =>{
    const {user} = route.params;
    const {fitnessPlan} = route.params;
    const {planAllocation} = route.params;
    const {session} = route.params;
    const {isOnProgress} = route.params;
    const {repetition} = route.params || 1;

    // check if the fitness plan has started
    const [currentDay, setCurrentDay] = useState(-1);


    const [routines, setRoutines] = useState(fitnessPlan.routinesList || []);
    const [selectedRoutine, setSelectedRoutine] = useState(null);

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

    const loadRoutines = () => (
        routines.length === 0 ? 
        <Text style = {styles.noAvailText}>{`No Routine\nAvailable`}</Text> 
        : routines.map((routine) => {
            if(routine.dayNumber < currentDay){
                return null;
            }
            return (
                <View key = {routine.dayNumber}>
                    <View style = {styles.dayTitleView}>
                        <Text style = {styles.dayTitleText}>{`Day ${routine.dayNumber}`}</Text>
                        {
                            routine.isRestDay || routine.dayNumber !== currentDay ? null :
                            <TouchableOpacity style ={styles.startButton} onPress={()=>{setSelectedRoutine(routine);changeConfirmVisible(true, "Once you quit this exercise, you will need to start from the beginning of today's exercise routine.\n\n Are you sure you want to start?")}}>
                                <Text style ={styles.startText}>Start</Text>
                            </TouchableOpacity>
                        }
                        
                    </View>

                    <View style = {styles.exerciseListView}>
                        {routine.isRestDay ? 
                            <Text style = {styles.restDayText}>Rest Day</Text> : 
                            <>
                                {
                                    
                                    routine.exercisesList.length == 0 ? null : routine.exercisesList.map((e) => {
                                        
                                        
                                        return (
                                            <TouchableOpacity onPress={()=>{navigation.navigate('ExerciseInstructionPage', {exercise:e})}} key = {e.exercise.exerciseID}>
                                                <ExerciseCard
                                                    routine = {routine}
                                                    exercise = {e}
                                                    isEdit={false}
                                                />
                                            </TouchableOpacity>
                                        );
                                    })
                                }
                            </>
                        }
                    </View>
                    
                </View>
            );
        })
    );

    useEffect(()=>{
        if(planAllocation){
            if(isOnProgress){
                // get the current day
                const today = new Date();
                const startDate = planAllocation.startDate.toDate();
                const diffTime = Math.abs(today - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setCurrentDay(diffDays);
            }
        }
    }, [planAllocation]);

    return(
        <View style = {styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={() => changeConfirmVisible(false)}>
                <ActionDialog
                    message={confirmMessage}
                    changeModalVisible={changeConfirmVisible}
                    action={()=>{navigation.navigate('UserPerformExercisePage', {user, fitnessPlan, planAllocation, session, routine:selectedRoutine})}}
                />
            </Modal>


            <ScrollView>
                <View style = {styles.routinesView}>
                    {loadRoutines()}
                </View>
                <View style = {styles.bottomView}>
                {
                    planAllocation.isNewEndDate || isOnProgress ? null : 
                    <Text style = {styles.textBottom}>{`${repetition} x ${routines.length} Days`}</Text>
                }
                
            </View>
            </ScrollView>

            

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',  
    },
    routinesView:{
        marginTop: scale(10),
    },
    noAvailText:{
        fontSize: scale(32),
        fontFamily: 'Poppins-Medium',
        paddingVertical: scale(10),
        marginVertical: scale(100),
        textAlign: 'center',
    },
    routinesView:{
        marginTop: scale(10),
    },
    dayTitleView:{
        backgroundColor:'#E28413',
        marginVertical: scale(15),
        paddingHorizontal: scale(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
        backgroundColor: '#E28413',

    },
    dayTitleText:{
        fontFamily: 'Poppins-Medium',
        fontSize: scale(20),
        padding: scale(2),
    },
    icon:{
        height: scale(25),
        width: scale(25),
    },

    exerciseListView:{
        justifyContent: 'center',
        alignItems: 'center',
    },

    restDayText:{
        fontFamily: 'Inter-Medium',
        fontSize: scale(25),
        marginBottom: scale(75),
        marginTop: scale(10),
    },
    bottomView:{
        backgroundColor: '#E28413',
        paddingBottom: scale(32),
        paddingTop: scale(16),
        marginTop: scale(32),
    },
    textBottom:{
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(32),
    
    },
    startButton:{
        backgroundColor: '#00AD3B',
        paddingHorizontal: scale(32),
        paddingVertical: scale(2),
        borderRadius: scale(5),
    },
    startText:{
        fontFamily: 'Poppins-Medium',
        fontSize: scale(16),
        color: 'white',

    }
});

export default UserFitnessPlanDetailsPage2;
