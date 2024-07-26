import React, {useState, useEffect, useCallback, useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Button, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { scale } from '../../components/scale';
import ExerciseCard from '../../components/ExerciseCard';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import EditFitnessPlanPresenter from '../../presenter/EditFitnessPlanPresenter';

const CoachEditFitnessPlanPage2 = ({navigation, route}) => {

    const {isEditing, fitnessPlan} = route.params;

    const [planInfo, setPlanInfo] = useState({
        coach: route.params.coach,
        photo: route.params.photo,
        goalType: route.params.goalType,
        description: route.params.description,
        name: route.params.name,
        medicalCheck: route.params.medicalCheck
    });

    // Copy the routines from the previous page
    const [tempOriginalRoutines, setTempOriginalRoutines] = useState([...route.params.routines]);
    const [routines, setRoutines] = useState(()=>{    
        return new EditFitnessPlanPresenter().deepCopy(tempOriginalRoutines);
    });
    
    const [refresh, setRefresh] = useState(false);
    const [isSave, setIsSave] = useState(false);

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

    // Save the routines to the array on the previous page
    const saveRoutines = async () => {
        try{
            changeLoadingVisible(true);

            new EditFitnessPlanPresenter({routines: routines}).validateRoutines();
            await new EditFitnessPlanPresenter({routines: routines}).calculateCalories();


            // Save the routines to array on previous page
            navigation.navigate('CoachEditFitnessPlanPage', {
                refresh:true,
                coach: planInfo.coach,
                photo: planInfo.photo,
                goalType: planInfo.goalType,
                description: planInfo.description,
                name: planInfo.name,
                medicalCheck: planInfo.medicalCheck,
                routines: routines,
                fitnessPlan: fitnessPlan
            });
        }catch(e){
            changeModalVisible(true, e.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const discardRoutines = () => {
        try{
            // Go back to the previous page
            // Without saving the current change
            navigation.navigate('CoachEditFitnessPlanPage', {
                refresh:true,
                coach: planInfo.coach,
                photo: planInfo.photo,
                goalType: planInfo.goalType,
                description: planInfo.description,
                name: planInfo.name,
                medicalCheck: planInfo.medicalCheck,
                routines: tempOriginalRoutines,
                fitnessPlan: fitnessPlan
            });
        }catch(e){
            changeModalVisible(true, e.message);
        }
    }

    const addExerciseDay = () => {
        try{
            changeLoadingVisible(true);
            new EditFitnessPlanPresenter({routines: routines}).addRoutine();
            setRefresh(true);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
        
    }

    const addRestDay = () => {
        try{
            changeLoadingVisible(true);
            new EditFitnessPlanPresenter({routines: routines}).addRestDay();
            setRefresh(true);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    const swapDay = (index) => {
        try{
            changeLoadingVisible(true);
            new EditFitnessPlanPresenter({routines: routines, updateRoutines: setRoutines}).swapRoutine(index);
            setRefresh(true);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }


    const removeDay = (index) =>{
        try{
            changeLoadingVisible(true);
            new EditFitnessPlanPresenter({routines: routines, updateRoutines: setRoutines}).removeRoutine(index);
            setRefresh(true);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    
    }

    const onRemoveExercise = (index, routine) =>{
        try{
            changeLoadingVisible(true);
            new EditFitnessPlanPresenter({routine: routine}).removeExercise(index);
            setRefresh(true);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }


    


    // Repeater Functions
    const loadRoutines = () => (
        routines.length === 0 ? 
        <Text style = {styles.noAvailText}>{`No Routine\nAvailable`}</Text> 
        : routines.map((routine, routineIndex) => {
            return (
                <View key = {routineIndex}>
                    <View style = {styles.dayTitleView}>
                        <Text style = {styles.dayTitleText}>{`Day ${routine.dayNumber}`}</Text>
                        <View style = {{flexDirection:'row', gap:scale(15)}}>
                            <TouchableOpacity onPress = {
                                swapDay.bind(this, routineIndex)
                                }>
                                <Image style = {styles.icon}  source = {require('../../../assets/swap_horizontal_icon.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress = {
                                removeDay.bind(this, routineIndex)
                                }>
                                <Image style = {styles.icon}  source = {require('../../../assets/trash_icon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style = {styles.exerciseListView}>
                        {routine.isRestDay ? 
                            <Text style = {styles.restDayText}>Rest Day</Text> : 
                            <>
                                {
                                    
                                    routine.exercisesList.length == 0 ? null : routine.exercisesList.map((e, index) => {
                                        
                                        return (
                                            <ExerciseCard
                                                key = {index}
                                                routine = {routine}
                                                exercise = {e}
                                                isEdit = {true}
                                                onDelete = {
                                                    ()=>onRemoveExercise(index, routine)
                                                }
                                            />
                                        );
                                    })
                                }
                                <TouchableOpacity onPress={()=>navigation.navigate('SelectExerciseListPage', {routineIndex, routines, planInfo, isEditing, fitnessPlan})}  style = {styles.addExerciseButton}>
                                    <Image style = {styles.icon} source = {require('../../../assets/add_box_icon.png')} />
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                    
                </View>
            );
        })
    );

    useEffect(() => {
          
        
        if (refresh){
            setRefresh(false);
        }
            
    }, [refresh]);

    return(
        <View style = {styles.container}>
            <View style = {styles.topButtonView}>
                <TouchableOpacity style = {styles.topButtons} onPress = {() => {setIsSave(false); changeConfirmVisible( true, 'Are you sure you want to discard these routines?')}}>
                    <Text style = {styles.topButtonText}>DISCARD</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.topButtons} onPress = {()=>{setIsSave(true); changeConfirmVisible(true, 'Are you sure you want to save these routines?')}}>
                    <Text style = {styles.topButtonText}>SAVE</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <ActionDialog
                        message = {confirmMessage}
                        changeModalVisible = {changeConfirmVisible}
                        action = {() => { isSave ? saveRoutines() : discardRoutines();}}
                    />
                </Modal>

                <View style = {styles.routinesView}>
                    {loadRoutines()}
                </View>
            </ScrollView>


            <View style = {styles.addDayButtonView}>
                <TouchableOpacity onPress = {
                    addExerciseDay
                    } style = {[styles.addDayButton, {backgroundColor: '#C42847'}]}>
                    <Text style = {styles.addDayButtonText}>ADD EXERCISE DAY</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    addRestDay
                    } style = {[styles.addDayButton, {backgroundColor:'#E28413'}]}>
                    <Text style = {styles.addDayButtonText}>ADD REST DAY</Text>
                </TouchableOpacity>
            </View>

            

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',  
    },
    topButtonView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: scale(20),
        paddingTop: scale(75),
        paddingBottom: scale(10),
    },
    topButtons:{
        backgroundColor: 'black',
        padding: scale(5),
        borderRadius: scale(50),
        width: scale(150),
    },
    topButtonText:{
        color: 'white',
        textAlign: 'center',
        fontFamily: 'League-Spartan',
        fontSize: scale(18),
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
    addExerciseButton:{
        paddingVertical: scale(10),
    },
    addDayButtonView:{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: scale(50),
        paddingVertical: scale(20),
    },
    addDayButton:{
        
        borderRadius: 10,
        width: scale(200),
        
    },
    addDayButtonText:{
        color: 'white',
        fontFamily: 'League-Spartan',
        fontSize: scale(18),
        padding: scale(10),
        textAlign: 'center',
        
    }
});

export default CoachEditFitnessPlanPage2;