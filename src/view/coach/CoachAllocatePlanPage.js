import { View, Text, StyleSheet, Modal, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState, useCallback } from "react";
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";

import DisplayPlanAllocationPresenter from '../../presenter/DisplayPlanAllocationPresenter';
import { useFocusEffect } from "@react-navigation/native";

const CoachAllocatePlanPage = ({navigation, route}) => {

    const { coach, history } = route.params;

    const [allocatedPlans, setAllocatedPlans] = useState([]);
    const [onProgress, setOnProgress] = useState([]);

    const [allocationID, setAllocationID] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');


    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    const loadPlanAllocation = async () => {
        try{
            changeLoadingVisible(true);
            setAllocationID('');
            setOnProgress([]);
            setAllocatedPlans([]);
            await new DisplayPlanAllocationPresenter({updateAllocatedPlans: setAllocatedPlans, updateOnProgress: setOnProgress}).displayPlanAllocation(history.id);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const onDeleteAllocatedPlan = async () => {
        try{
            changeLoadingVisible(true);
            await new DisplayPlanAllocationPresenter().deletePlanAllocation(allocationID);
            
            await loadPlanAllocation();
            changeModalVisible(true, 'Plan deleted successfully');
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleString('en-US', {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };


    useFocusEffect(
        useCallback(() => {
            loadPlanAllocation();
        }
    , []));


    return (
        <View style={styles.container}>

            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeConfirmVisible(false)}>
                <ActionDialog
                message = {confirmMessage}
                changeModalVisible = {changeConfirmVisible}
                action = {onDeleteAllocatedPlan}
                />
            </Modal>

            <ScrollView contentContainerStyle = {styles.planView}>
                <View style = {styles.allocateContainer}>
                    <Text style = {styles.titleText}>Allocate Plan</Text>
                    {
                            allocatedPlans.length === 0 ?
                            null :
                            allocatedPlans.map((plan, index) => {
                                return (
                                    <View style = {[styles.planItem, {justifyContent:'space-between', }]} key = {index}>
                                        <View style = {{flexDirection:'row', gap: scale(25),}}>
                                        {plan.details !== null ?
                                            <Image source = {{uri: plan.details.fitnessPlanPicture}} style = {styles.planImage} />
                                            :
                                            <View style = {styles.planImage}/>
                                        }

                                        {plan.details === null ? 
                                        
                                            <Text style = {styles.deletedText}>Plan unavailable or deleted</Text>
                                        :

                                            <View >
                                                <Text>{`${formatDate(plan.plan.startDate)} - ${formatDate(plan.plan.endDate)}`}</Text>
                                                <Text style = {styles.planNameText}>{plan.details.fitnessPlanName}</Text>

                                                <View style = {styles.statsView}>
                                                    <View style = {styles.stats}>
                                                        <Image source = {require('../../../assets/clock_icon.png')} style = {styles.statsIcon}/>
                                                        <Text>{plan.details.routinesList.length} Days</Text>
                                                    </View>
                                                    <View style = {styles.stats}>
                                                        <Image source = {require('../../../assets/fire_icon.png')} style = {styles.statsIcon}/>
                                                        <Text>{Math.ceil(plan.details.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0))} kcal</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        }
                                        </View>
                                        <TouchableOpacity onPress = {()=>{setAllocationID(plan.plan.allocationID);changeConfirmVisible (true, 'Are you sure you want to delete this plan?')}} style = {{padding: scale(10)}}>
                                            <Image style = {styles.icon} source = {require('../../../assets/trash_icon.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    );
                                }
                                )
                            
                        }
                    <TouchableOpacity onPress={()=>navigation.navigate("CoachAllocatePlanPage2", {coach, history})}  style = {styles.addPlanButton}>
                        <Image style = {styles.icon} source = {require('../../../assets/add_box_icon.png')} />
                    </TouchableOpacity>
                </View>

                {onProgress.length === 0 ? null :
                <View style = {styles.onProgressContainer}>
                    <Text style = {styles.titleText}>On Progress</Text>
                    {
                        onProgress.map((plan, index) => {
                            return(
                                <View style = {[styles.planItem,{gap: scale(25),}]} key = {index}>
                                {plan.details !== null ?
                                    <Image source = {{uri: plan.details.fitnessPlanPicture}} style = {styles.planImage} />
                                    :
                                    <View style = {styles.planImage}/>
                                }

                                {plan.details === null ? 
                                
                                    <Text style = {styles.deletedText}>Plan unavailable or deleted</Text>
                                :

                                    <View>
                                        <Text>{`${formatDate(plan.plan.startDate)} - ${formatDate(plan.plan.endDate)}`}</Text>
                                        <Text style = {styles.planNameText}>{plan.details.fitnessPlanName}</Text>

                                        <View style = {styles.statsView}>
                                            <View style = {styles.stats}>
                                                <Image source = {require('../../../assets/clock_icon.png')} style = {styles.statsIcon}/>
                                                <Text>{plan.details.routinesList.length} Days</Text>
                                            </View>
                                            <View style = {styles.stats}>
                                                <Image source = {require('../../../assets/fire_icon.png')} style = {styles.statsIcon}/>
                                                <Text>{Math.ceil(plan.details.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0))} kcal</Text>
                                            </View>
                                        </View>

                                    </View>
                                }
                            </View>
                            );
                        })
                    }
                </View>
                }
                
            </ScrollView>

            <View style = {styles.viewHistoryContainer}>
                <TouchableOpacity style = {styles.viewHistoryButton} onPress={() => navigation.navigate('CoachAllocateHistoryPage', {history})}>
                    <Text style = {styles.historyButtonText}>View History</Text>
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
    planView:{
        gap: scale(20),
    },
    allocateContainer:{
    },
    titleText: {
        fontSize: scale(24),
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        marginTop: scale(10),
        paddingHorizontal: scale(15),
    },
    addPlanButton:{
        paddingVertical: scale(10),
        alignItems: 'center',
    },
    icon:{
        height: scale(25),
        width: scale(25),
    },
    viewHistoryContainer:{
        padding: scale(15),
        marginBottom: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewHistoryButton:{
        backgroundColor: '#E28413',
        paddingVertical: scale(10),
        paddingHorizontal: scale(25),
        borderRadius: scale(10),
    },
    historyButtonText:{
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        color: 'white',
    },
    planItem:{
        borderColor: 'lightgray',
        borderWidth: 2,
        flexDirection: 'row',
        padding: scale(10),
        
        alignItems: 'center',
        
    },
    deletedText:{
        fontSize: scale(16),
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        paddingVertical: scale(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    planImage:{
        width: scale(100),
        height: scale(100),
        borderRadius: scale(20),
        backgroundColor: '#D3D3D3',
    },
    planNameText:{
        fontSize: scale(18),
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        paddingVertical:scale(5),
    },
    statsView:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    stats:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
    },
    statsIcon:{
        width: scale(15),
        height: scale(15),
    
    },

});

export default CoachAllocatePlanPage;