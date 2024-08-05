import { View, Text, StyleSheet, Modal, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native"
import { scale } from "../../components/scale";
import DatePicker from 'react-native-date-picker';
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";

import AllocatePlanPresenter from "../../presenter/AllocatePlanPresenter";

const CoachAllocatePlanPage3 = ({navigation, route}) => {
    const { coach, history } = route.params;
    const {selectedPlan} = route.params;


    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    
    // Date Picker
    const [open, setOpen] = useState(false)

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

    // Date formatter
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const updateEndDate = () => {
        if(startDate){
            const newEndDate = new Date(startDate.getTime() + selectedPlan.routinesList.length * 86400000);
            newEndDate.setDate(newEndDate.getDate() - 1);
            newEndDate.setHours(23, 59, 59, 999);
            setEndDate(newEndDate);
        }
    }

    const addAllocatePlan = async() =>{
        try{
            changeLoadingVisible(true);
            await new AllocatePlanPresenter({fitnessPlanID: selectedPlan.fitnessPlanID, history}).addAllocatePlan(startDate, endDate);
            Alert.alert("Success", "Plan has been allocated successfully");
            navigation.navigate("CoachAllocatePlanPage", {coach, history});
        }catch(error){
            changeModalVisible(true, error.message.replace("Error: ", ""));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const getTomorrow = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }

    useEffect(() => {
        updateEndDate();
    }, [startDate]);

    return (
        <>
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
                action = {()=>console.log('Action')}
                />
            </Modal>
            
            <ScrollView contentContainerStyle = {styles.container}>
                <View style = {styles.topContainer}>
                    <View style = {styles.titleContainer}>
                        <Text style = {styles.planNameText}>{selectedPlan.fitnessPlanName}</Text>
                        <View style = {styles.statsView}>
                            <View style = {styles.stats}>
                                <Image source = {require('../../../assets/clock_icon.png')} style = {styles.icon}/>
                                <Text style = {styles.statsText}>{selectedPlan.routinesList.length} Days</Text>
                            </View>
                            <View style = {styles.stats}>
                                <Image source = {require('../../../assets/fire_icon.png')} style = {styles.icon}/>
                                <Text style = {styles.statsText}>{Math.ceil(selectedPlan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a, b) => a + b, 0))} kcal</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style = {styles.planPicContainer}>
                    <View style={styles.imagePlaceholder}>
                            <Image source={{uri:selectedPlan.fitnessPlanPicture}} style={{width: '100%', height: '100%', borderRadius: scale(18)}} />
                    </View>
                </View>

                <View style = {styles.detailsView}>
                    <Text style = {styles.detailsTitleText}>GOAL</Text>
                    <Text style = {styles.detailsText}>{selectedPlan.planGoal}</Text>

                    <Text style = {styles.detailsTitleText}>DESCRIPTION</Text>
                    <Text style = {styles.detailsText}>{selectedPlan.fitnessPlanDescription}</Text>

                    <Text style = {styles.detailsTitleText}>SELECT START DATE</Text>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <View>
                            <Text style={styles.dateContainer}>{startDate ? formatDate(startDate) : "Select start date"}</Text>
                        </View>
                    </TouchableOpacity>
                    <DatePicker
                    modal
                    open={open}
                    date={startDate || getTomorrow()}
                    mode='date'
                    minimumDate={getTomorrow()}
                    maximumDate={history.endDate.toDate()}
                    onConfirm={(date) => {
                        setOpen(false);
                        setStartDate(date);
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                    />

                    <Text style = {styles.detailsTitleText}>ESTIMATED END DATE</Text>
                    <Text style = {styles.detailsText}>{formatDate(endDate)}</Text>
                </View>
            </ScrollView>
            <View style = {styles.bottomButtonView}>
                <TouchableOpacity onPress = {addAllocatePlan} style = {styles.bottomButton}>
                    <Text style = {styles.bottomButtonText}>Allocate Plan</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

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
    dateContainer: {
        fontFamily: 'Inter',
        fontSize: scale(16),
        marginBottom: scale(5),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#c0c0c0',
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

export default CoachAllocatePlanPage3;