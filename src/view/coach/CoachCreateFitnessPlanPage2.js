import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { scale } from '../../components/scale';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';
import CreateFitnessPlanPresenter from '../../presenter/CreateFitnessPlanPresenter';

const CoachCreateFitnessPlanPage2 = ({navigation, route}) => {

    const {coach, photo, goalType, details, name, medicalCheck } = route.params;

    const [routines, setRoutines] = useState([...route.params.routines]);
    

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

    const saveRoutines = () => {
        try{
            changeLoadingVisible(true);
            navigation.navigate('CoachCreateFitnessPlanPage', {
                isSave: true,
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

    addNewDay = async () => {
        try{
            changeLoadingVisible(true);
            new CreateFitnessPlanPresenter({routines: routines}).addRoutine();
            console.log('Added, now its : ' + routines.length);
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
        
    }



    return (
        <ScrollView contentContainerStyle = {styles.container}>
            <View style = {styles.topButtonView}>
                <TouchableOpacity style = {styles.topButtons} onPress = {() => changeConfirmVisible( true, 'Are you sure you want to discard these Routines?')}>
                    <Text style = {styles.topButtonText}>Discard</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.topButtons} onPress = {saveRoutines}>
                    <Text style = {styles.topButtonText}>Save</Text>
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
                    action = {() => {
                        setRoutines([]);
                        navigation.goBack();
                    }}
                />
            </Modal>


            <View style = {styles.addDayButtonView}>
                <TouchableOpacity onPress = {addNewDay} style = {styles.addDayButton}>
                    <Text style = {styles.addDayButtonText}>Add New Day</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );


    // return (
    //     <View style = {styles.container}>
    //         <TouchableOpacity onPress={() => navigation.navigate('CoachCreateFitnessPlanPage',{
    //             exercisesSaved : true,
    //             coach: coach,
    //             photo: photo,
    //             goalType: goalType,
    //             details: 'WAKAKAKA',
    //             name: 'STANDAMO',
    //             medicalCheck: false,
    //             testMe:'AHHAAHAHA'

    //         })}>
    //             <Text>Save</Text>
    //         </TouchableOpacity>


    //         <TouchableOpacity onPress={() => navigation.navigate('CoachCreateFitnessPlanPage',{
    //             exercisesSaved : false,
    //             coach: coach,
    //             photo: photo,
    //             goalType: goalType,
    //             details: details,
    //             name: name,
    //             medicalCheck: medicalCheck

    //         })}>
    //             <Text>Dont Save</Text>
    //         </TouchableOpacity>


    //         <Text>{photo  === null ? '' : photo.uri}</Text>
    //         <Text>{goalType}</Text>
    //         <Text>{details}</Text>
    //         <Text>{name}</Text>
    //         <Text>{medicalCheck}</Text>
    //     </View>
    // );

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
        fontSize: scale(20),
    },
    addDayButtonView:{
        alignItems: 'center',
        marginTop: scale(50),
    },
    addDayButton:{
        backgroundColor: '#E28413',
        borderRadius: scale(50),
        width: scale(175),
        
    },
    addDayButtonText:{
        color: 'white',
        fontFamily: 'League-Spartan',
        fontSize: scale(20),
        padding: scale(10),
        textAlign: 'center',
        
    }
});


export default CoachCreateFitnessPlanPage2;