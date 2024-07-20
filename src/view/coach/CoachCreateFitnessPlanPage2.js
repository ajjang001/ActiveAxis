import React, {useState, useEffect, useCallback, useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, Button, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { scale } from '../../components/scale';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';
import { useRefresh } from '../../components/RefreshContext';

import CreateFitnessPlanPresenter from '../../presenter/CreateFitnessPlanPresenter';

// import YoutubePlayer from "react-native-youtube-iframe";


const CoachCreateFitnessPlanPage2 = ({navigation, route}) => {
    
    const {coach, photo, goalType, details, name, medicalCheck } = route.params;
    const { refresh, refreshData, setRefresh } = useRefresh();

    // Copy the routines from the previous page
    const [routines, setRoutines] = useState([...route.params.routines]);

    //const [r, setR] = useState(false);
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

    // const refreshDataFunc = () => {
    //     setR(true);
    // };

    // Save the routines to the array on the previous page
    const saveRoutines = () => {
        try{
            changeLoadingVisible(true);


            // Save the routines to array on previous page
            navigation.navigate('CoachCreateFitnessPlanPage', {
                refresh:true,
                coach: coach,
                photo: photo,
                goalType: goalType,
                details: details,
                name: name,
                medicalCheck: medicalCheck,
                routines: routines
            }
            );
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    const discardRoutines = () => {
        try{
            // Go back to the previous page
            // Without saving the current change
            navigation.goBack();
        }catch(e){
            changeModalVisible(true, e.message);
        }
    }

    const addExerciseDay = () => {
        try{
            changeLoadingVisible(true);
            new CreateFitnessPlanPresenter({routines: routines}).addRoutine();
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
            new CreateFitnessPlanPresenter({routines: routines}).addRestDay();
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
            new CreateFitnessPlanPresenter({routines: routines, updateRoutines: setRoutines}).swapRoutine(index);
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
            new CreateFitnessPlanPresenter({routines: routines, updateRoutines: setRoutines}).removeRoutine(index);
            setRefresh(true);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    
    }



    // Repeater Functions
    const loadRoutines = () => (
        routines.length === 0 ? null : routines.map((routine, index) => {
            return (
                <View key = {index}>
                    <View style = {styles.dayTitleView}>
                        <Text style = {styles.dayTitleText}>{`Day ${routine.dayNumber}`}</Text>
                        <View style = {{flexDirection:'row', gap:scale(15)}}>
                            <TouchableOpacity onPress = {swapDay.bind(this, index)}>
                                <Image style = {styles.icon}  source = {require('../../../assets/swap_horizontal_icon.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress = {removeDay.bind(this, index)}>
                                <Image style = {styles.icon}  source = {require('../../../assets/trash_icon.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style = {styles.exerciseListView}>
                        {routine.isRestDay ? 
                            <Text style = {styles.restDayText}>Rest Day</Text> : 
                            <>
                                {
                                    routine.exercisesList.map((e, index) => {
                                        return (
                                            <View key = {index}>
                                                <Text>{e.exerciseName}</Text>
                                            </View>
                                        );
                                    })
                                }
                                <TouchableOpacity onPress={()=>navigation.navigate('SelectExerciseListPage', {routine, onGoBack: refreshData})}  style = {styles.addExerciseButton}>
                                    <Image style = {styles.icon} source = {require('../../../assets/add_box_icon.png')} />
                                </TouchableOpacity>
                            </>
                        }
                    </View>
                    {/*
                        video !== '' ?
                        (<View>
                            <YoutubePlayer
                              height={300}
                              play={'play'}
                              videoId={video}
                            />
                          </View>) : null
                    */}
                </View>
            );
        })
    );

    

    useEffect(() => {
          
        // if (route.params?.refresh){
        //     route.params.refresh = false;
        //     console.log('refreshed params');
        // }
        
        if (refresh){
            console.log(routines);
            setRefresh(false);
        }
            
        //route.params?.refresh
    }, [refresh]);





    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <View style = {styles.topButtonView}>
                <TouchableOpacity style = {styles.topButtons} onPress = {() => {setIsSave(false); changeConfirmVisible( true, 'Are you sure you want to discard these routines?')}}>
                    <Text style = {styles.topButtonText}>DISCARD</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.topButtons} onPress = {()=>{setIsSave(true); changeConfirmVisible(true, 'Are you sure you want to save these routines?')}}>
                    <Text style = {styles.topButtonText}>SAVE</Text>
                </TouchableOpacity>
            </View>

            
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


            <View style = {styles.addDayButtonView}>
                <TouchableOpacity onPress = {addExerciseDay} style = {[styles.addDayButton, {backgroundColor: '#C42847'}]}>
                    <Text style = {styles.addDayButtonText}>ADD EXERCISE DAY</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress = {addRestDay} style = {[styles.addDayButton, {backgroundColor:'#E28413'}]}>
                    <Text style = {styles.addDayButtonText}>ADD REST DAY</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
        
        paddingTop: scale(75),
    },
    topButtonView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: scale(20),
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
    routinesView:{
        marginTop: scale(20),
    },
    dayTitleView:{
        backgroundColor:'#E28413',
        marginVertical: scale(10),
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
    },
    addExerciseButton:{
    },
    addDayButtonView:{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: scale(50),
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


export default CoachCreateFitnessPlanPage2;