import { View, Text, StyleSheet, Modal, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";

import AllocatePlanPresenter from '../../presenter/AllocatePlanPresenter';

const CoachAllocatePlanPage2 = ({navigation, route}) => {

    const { coach, history } = route.params;

    const [recommendedPlan, setRecommendedPlan] = useState([]);
    const [otherPlan, setOtherPlan] = useState([]);

    const [selectedPlan, setSelectedPlan] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');


    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }


    const loadListOfPlans = async () => {
        try{
            changeLoadingVisible(true);
            setRecommendedPlan([]);
            setOtherPlan([]);
            await new AllocatePlanPresenter({updateRecommendedPlan: setRecommendedPlan, updateOtherPlan: setOtherPlan}).getPlans(coach.accountID, history.user);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const selectPlanHandler = (plan) => {
        setSelectedPlan(plan);
    }

    useEffect(() => {
        loadListOfPlans();
    }, []);


    return (
        <View contentContainerStyle={styles.container}>
            
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <ScrollView style ={{height:scale(825)}}>
                {
                    recommendedPlan.length > 0 ?
                        <View style={styles.planView}>
                            <Text style={styles.titleText}>RECOMMENDED</Text>
                            {
                                recommendedPlan.map((plan, index) => (
                                    <TouchableOpacity key={index} style={[styles.planContainer, selectedPlan !== null ? (plan.fitnessPlanID === selectedPlan.fitnessPlanID ? {backgroundColor:'#c0c0c0'} : null) : null ]} onPress = {() => selectPlanHandler(plan)}>
                                        {plan !== null ?
                                            <Image source = {{uri: plan.fitnessPlanPicture}} style = {styles.planImage} />
                                            :
                                            <View style = {styles.planImage}/>
                                        }

                                        {plan === null ? 
                                        
                                            <Text style = {styles.deletedText}>Plan unavailable or deleted</Text>
                                        :

                                            <View style = {{width:'50%'}}>
                                                <Text style = {styles.planNameText}>{plan.fitnessPlanName}</Text>

                                                <View style = {styles.statsView}>
                                                    <View style = {styles.stats}>
                                                        <Image source = {require('../../../assets/clock_icon.png')} style = {styles.icon}/>
                                                        <Text>{plan.routinesList.length} Days</Text>
                                                    </View>
                                                    <View style = {styles.stats}>
                                                        <Image source = {require('../../../assets/fire_icon.png')} style = {styles.icon}/>
                                                        <Text>{Math.ceil(plan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0))} kcal</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        }
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        :
                        null
                }
                {
                    otherPlan.length > 0 ?
                        <View style={styles.planView}>
                            <Text style={styles.titleText}>YOUR FITNESS PLANS</Text>
                            {
                                otherPlan.map((plan, index) => (
                                    <TouchableOpacity key={index} style={[styles.planContainer, selectedPlan !== null ? (plan.fitnessPlanID === selectedPlan.fitnessPlanID ? {backgroundColor:'#c0c0c0'} : null) : null ]} onPress={() => selectPlanHandler(plan)}>
                                        {plan !== null ?
                                            <Image source = {{uri: plan.fitnessPlanPicture}} style = {styles.planImage} />
                                            :
                                            <View style = {styles.planImage}/>
                                        }

                                        {plan === null ? 
                                        
                                            <Text style = {styles.deletedText}>Plan unavailable or deleted</Text>
                                        :

                                            <View style = {{width:'50%'}}>
                                                <Text style = {styles.planNameText}>{plan.fitnessPlanName}</Text>

                                                <View style = {styles.statsView}>
                                                    <View style = {styles.stats}>
                                                        <Image source = {require('../../../assets/clock_icon.png')} style = {styles.icon}/>
                                                        <Text>{plan.routinesList.length} Days</Text>
                                                    </View>
                                                    <View style = {styles.stats}>
                                                        <Image source = {require('../../../assets/fire_icon.png')} style = {styles.icon}/>
                                                        <Text>{Math.ceil(plan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0))} kcal</Text>
                                                    </View>
                                                </View>

                                            </View>
                                        }
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        :
                        null
                }
                {
                    recommendedPlan.length === 0 && otherPlan.length === 0 ?
                        <View style={styles.noPlanView}>
                            <Text style={styles.noTitleText}>No Plan Available</Text>
                        </View>
                        :
                        null
                }
            </ScrollView>

            <View style={styles.continueView}>
                <TouchableOpacity disabled = {selectedPlan !== null ? false : true} style={[styles.continueButton , selectedPlan !== null ? {backgroundColor: 'black'} : {backgroundColor: '#9a9a9a'}]} onPress={()=>navigation.navigate('CoachAllocatePlanPage3', {coach, history, selectedPlan})}>
                    <Text style={styles.continueButtonText}>Next</Text>
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
    planView: {
        marginVertical: scale(10),
    },
    planContainer: {
        padding: scale(10),
        borderColor: 'gray',
        borderWidth: 1,
        flexDirection: 'row',
        gap: scale(25),
        alignItems: 'center',
    },
    titleText: {
        fontSize: scale(24),
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
        backgroundColor: '#C42847',
        padding: scale(10),
    },
    planText: {
        fontSize: scale(15),
        
    },
    noPlanView:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noTitleText:{
        fontSize: scale(20),
        fontWeight: 'bold',
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
        alignItems: 'center',
        gap: scale(25),
    },
    stats:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
    },
    icon:{
        width: scale(15),
        height: scale(15),
    
    },
    continueView:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E28413', 
        padding: scale(15),
        paddingBottom: scale(250),
        
    },
    continueButton:{
        paddingVertical: scale(10),
        borderRadius: scale(10),
        width: scale(150),
    },
    continueButtonText:{
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(18),
        color: 'white',
        textAlign: 'center',
    },
});

export default CoachAllocatePlanPage2;