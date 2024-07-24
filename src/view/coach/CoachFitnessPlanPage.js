import React, {useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal, Alert, ScrollView } from 'react-native';
import { scale } from "../../components/scale";
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import DisplayFitnessPlanPresenter from "../../presenter/DisplayFitnessPlanPresenter";
import DeleteFitnessPlanPresenter from "../../presenter/DeleteFitnessPlanPresenter";


const CoachFitnessPlanPage = ({route, navigation}) => {
    const {coach} = route.params;
    const {fitnessPlan} = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
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


    const loadRoutines = async() =>{
        try{
            changeLoadingVisible(true);
            await new DisplayFitnessPlanPresenter({fitnessPlan:fitnessPlan}).loadRoutines();
            
        }catch(error){
            changeModalVisible(true, error.message.replace("Error: ", ""));
        }finally{
            changeLoadingVisible(false);
        }
    };

    const deleteHandler = async() =>{
        try{
            changeLoadingVisible(true);

            await new DeleteFitnessPlanPresenter({fitnessPlan: fitnessPlan}).deleteFitnessPlan();

            navigation.navigate('CoachListOfFitnessPlansPage', {refresh: true, coach: coach});
            Alert.alert('Success', 'Fitness Plan Deleted Successfully');

        }catch(error){
            changeModalVisible(true, error.message.replace("Error: ", ""));
        }finally{
            changeLoadingVisible(false);
        }
    };


    useEffect(() => {
        loadRoutines();
    }, []);

    return (
        <>
            <ScrollView contentContainerStyle = {styles.container}>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeConfirmVisible(false)}>
                    <ActionDialog
                    message = {confirmMessage}
                    changeModalVisible = {changeConfirmVisible}
                    action = {isDeleting ? ()=>deleteHandler() : null}
                    />
                </Modal>

                <View style = {styles.topContainer}>
                    <View style = {styles.titleContainer}>
                        <Text style = {styles.planNameText}>{fitnessPlan.fitnessPlanName}</Text>
                        <View style = {styles.statsView}>
                            <View style = {styles.stats}>
                                <Image source = {require('../../../assets/clock_icon.png')} style = {styles.icon}/>
                                <Text style = {styles.statsText}>{fitnessPlan.routinesList.length} Days</Text>
                            </View>
                            <View style = {styles.stats}>
                                <Image source = {require('../../../assets/fire_icon.png')} style = {styles.icon}/>
                                <Text style = {styles.statsText}>{Math.ceil(fitnessPlan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a, b) => a + b, 0))} kcal</Text>
                            </View>
                        </View>
                    </View>
                    <View style = {styles.iconButtonView}>
                        <TouchableOpacity>
                            <Image source={require('../../../assets/edit_icon.png')} style = {styles.iconButton}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress ={()=>{setIsDeleting(true);changeConfirmVisible(true, 'Are you sure you want to delete this fitness plan?')}}>
                            <Image source={require('../../../assets/trash_icon.png')} style = {styles.iconButton}/>
                        </TouchableOpacity>
                        
                    </View>
                </View>


                <View style = {styles.planPicContainer}>
                    <View style={styles.imagePlaceholder}>
                            <Image source={{uri:fitnessPlan.fitnessPlanPicture}} style={{width: '100%', height: '100%', borderRadius: scale(18)}} />
                    </View>
                </View>

                <View style = {styles.detailsView}>
                    <Text style = {styles.detailsTitleText}>GOAL</Text>
                    <Text style = {styles.detailsText}>{fitnessPlan.planGoal}</Text>

                    <Text style = {styles.detailsTitleText}>DESCRIPTION</Text>
                    <Text style = {styles.detailsText}>{fitnessPlan.fitnessPlanDescription}</Text>
                </View>

                
            </ScrollView>
            <View style = {styles.bottomButtonView}>
                <TouchableOpacity onPress = {()=>{navigation.navigate('CoachFitnessPlanPage2', {coach, fitnessPlan})}} style = {styles.bottomButton}>
                    <Text style = {styles.bottomButtonText}>View Routines</Text>
                </TouchableOpacity>
            </View>
        </>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    topContainer:{
        paddingHorizontal: scale(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer:{
        maxWidth: '70%',
    },
    planNameText:{
        fontSize: scale(25),
        marginBottom: scale(5),
        fontWeight: 'bold',
    },
    statsView:{
        flexDirection: 'row',
        gap: scale(50),
        alignItems: 'center',
        
    },
    stats:{
        flexDirection: 'row',
        gap: scale(5),
        alignItems: 'center',
    },
    statsText:{
        fontFamily: 'League-Spartan',
        fontSize: scale(16),
    },
    icon:{
        width: scale(20),
        height: scale(20),
    
    },
    iconButtonView:{
        flexDirection: 'row',
        gap: scale(20),
    },
    iconButton:{
        width: scale(35),
        height: scale(35),
    },
    planPicContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E28413',
        marginTop: scale(20),
        padding: scale(20),
    },
    imagePlaceholder: {
        width: '90%',
        height: scale(225),
        backgroundColor: '#D3D3D3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scale(18),
    },
    detailsView: {
        paddingHorizontal: scale(20)
    },
    detailsTitleText:{
        marginTop: scale(20),
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(18),
    },
    detailsText:{
        fontFamily: 'Poppins',
        fontSize: scale(16),
    },
    bottomButtonView:{
        backgroundColor: '#FBF5F3',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scale(50)
    },
    bottomButton:{
        backgroundColor: '#E28413',
        padding: scale(5),
        width: scale(175),
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: scale(20),
    },
    bottomButtonText:{
        color: 'white',
        fontFamily: 'League-Spartan-SemiBold',
        fontSize: scale(18),
    },
    
});

export default CoachFitnessPlanPage;