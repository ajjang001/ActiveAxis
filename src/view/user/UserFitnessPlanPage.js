import { View, Text, StyleSheet, Modal, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState, useCallback } from "react";
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";
import { useFocusEffect } from "@react-navigation/native";

import DisplayFitnessPlansPresenter from "../../presenter/DisplayFitnessPlansPresenter";


const UserFitnessPlanPage = ({ navigation, route }) => {

    const {user} = route.params;

    const [session, setSession] = useState(null);

    const [allocatedPlans, setAllocatedPlans] = useState([]);
    const [onProgress, setOnProgress] = useState([]);

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


    const getCurrentSession = async()=>{
        try{
            changeLoadingVisible(true);
            setSession(null);
            await new DisplayFitnessPlansPresenter({updateSession: setSession}).getCurrentSession(user.accountID);
        }catch(e){
            console.log(e.message);
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    const loadPlanAllocation = async()=>{
        try{
            changeLoadingVisible(true);
            setOnProgress([]);
            setAllocatedPlans([]);
            await new DisplayFitnessPlansPresenter({updateAllocatedPlans: setAllocatedPlans, updateOnProgress: setOnProgress}).displayPlanAllocation(session.sessionID);

        }catch(e){
            console.log(e.message);
            changeModalVisible(true, e.message);
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
            day: 'numeric',
            
        });
    };

    useFocusEffect(
        useCallback( ()=>{
            getCurrentSession();
        } , [])
    );

    useEffect(()=>{
        if(session){
            loadPlanAllocation();
        }
    },[session]);

    return (
        <View style={styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <View style = {styles.contentContainer}>
                <Text style = {styles.contentTitle}>My Fitness Plan</Text>
                <ScrollView contentContainerStyle = {styles.scrollView}>
                    {
                        !session ? 
                        <Text style = {styles.noAvailText}>No Fitness Plan Available</Text>
                        :
                        <View style = {{gap:scale(16)}}>
                            {
                                onProgress.length <= 0 ? null :
                                <View>
                                    <Text style = {styles.titleText}>In Progress</Text>
                                    {
                                        onProgress.map((plan, index)=>{
                                            return(
                                                <TouchableOpacity onPress = {()=>{navigation.navigate('UserFitnessPlanDetailsPage', {user, fitnessPlan: plan.details, planAllocation:plan.plan, session, allocatedPlans, isOnProgress: true})}} style = {[styles.planItem,{gap: scale(25),}]} key = {index}>
                                                    {plan.details === null ?
                                                        <View style = {styles.planImage}/>
                                                        :
                                                        <Image source = {{uri: plan.details.fitnessPlanPicture}} style = {styles.planImage} />
                                                    }
                                                    {plan.details === null ? 
                                
                                                        <Text style = {styles.deletedText}>Plan unavailable or deleted</Text>
                                                    :

                                                        <View>
                                                            <Text>{`${formatDate(plan.plan.startDate.toDate())} - ${formatDate(plan.plan.endDate.toDate())}`}</Text>
                                                            <Text style = {styles.planNameText}>{plan.details.fitnessPlanName}</Text>

                                                            <View style = {styles.statsView}>
                                                                <View style = {styles.stats}>
                                                                    <Image source = {require('../../../assets/clock_icon.png')} style = {styles.statsIcon}/>
                                                                    <Text>{plan.details.routinesList.length * plan.plan.repetition} Days</Text>
                                                                </View>
                                                                <View style = {styles.stats}>
                                                                    <Image source = {require('../../../assets/fire_icon.png')} style = {styles.statsIcon}/>
                                                                    <Text>{Math.ceil(plan.details.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0)) * plan.plan.repetition} kcal</Text>
                                                                </View>
                                                            </View>

                                                        </View>
                                                    }
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </View>
                            }
                            {
                                allocatedPlans.length <= 0 ? null :
                                <View>
                                    <Text style = {styles.titleText}>Allocated Plans</Text>
                                    {
                                        allocatedPlans.map((plan, index) => {
                                            return (
                                                <TouchableOpacity onPress = {()=>{navigation.navigate('UserFitnessPlanDetailsPage', {user, fitnessPlan: plan.details, planAllocation:plan.plan, session, allocatedPlans, isOnProgress: false})}} style = {[styles.planItem, {justifyContent:'space-between', }]} key = {index}>
                                                    <View style = {{flexDirection:'row', gap: scale(25)}}>
                                                    {plan.details !== null ?
                                                        <Image source = {{uri: plan.details.fitnessPlanPicture}} style = {styles.planImage} />
                                                        :
                                                        <View style = {styles.planImage}/>
                                                    }
            
                                                    {plan.details === null ? 
                                                    
                                                        <Text style = {styles.deletedText}>Plan unavailable or deleted</Text>
                                                    :
            
                                                        <View>
                                                            <Text>{`${formatDate(plan.plan.startDate.toDate())} - ${formatDate(plan.plan.endDate.toDate())}`}</Text>
                                                            <Text style = {styles.planNameText}>{plan.details.fitnessPlanName}</Text>
            
                                                            <View style = {styles.statsView}>
                                                                <View style = {styles.stats}>
                                                                    <Image source = {require('../../../assets/clock_icon.png')} style = {styles.statsIcon}/>
                                                                    <Text>{plan.details.routinesList.length * plan.plan.repetition} Days</Text>
                                                                </View>
                                                                <View style = {styles.stats}>
                                                                    <Image source = {require('../../../assets/fire_icon.png')} style = {styles.statsIcon}/>
                                                                    <Text>{Math.ceil(plan.details.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0)) * plan.plan.repetition} kcal</Text>
                                                                </View>
                                                            </View>
            
                                                        </View>
                                                    }
                                                    </View>
                                                </TouchableOpacity>
                                                );
                                            }
                                            )
                                    }
                                </View>
                            }    
                        </View>

                    }                    
                </ScrollView>

                <View style = {styles.bottomView}>
                    <TouchableOpacity onPress = {()=>{navigation.navigate('UserFitnessPlanHistoryPage', {history:session})}} style = {styles.button}>
                        <Text style = {styles.buttonText}>History</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    contentTitle:{
        fontSize: scale(32),
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
    },
    noAvailText:{
        fontSize: scale(18),
        fontFamily: 'Inter',
        textAlign: 'center',
        marginVertical: scale(16),
    },
    scrollView:{
        height: '80%',
        marginVertical: scale(16),
    },
    titleText: {
        fontSize: scale(24),
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        marginTop: scale(10),
        paddingHorizontal: scale(15),
    },
    planItem:{
        borderColor: 'lightgray',
        backgroundColor:'white',
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
    icon:{
        height: scale(25),
        width: scale(25),
    },
    bottomView:{
        paddingVertical:scale(16),
        paddingBottom:scale(240),
        alignItems:'center'
    },
    button:{
        backgroundColor:'#E28413',
        paddingVertical:scale(4),
        width:scale(140),
        borderRadius:scale(8)
    },
    buttonText:{
        textAlign:'center',
        fontFamily:'Inter-SemiBold',
        fontSize:scale(18),
        color:'white'
    }
});

export default UserFitnessPlanPage;