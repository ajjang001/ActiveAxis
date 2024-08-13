import { View, Text, StyleSheet, Modal, Image, ScrollView, TouchableOpacity } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";

import DisplayAllocateHistoryPresenter from '../../presenter/DisplayAllocateHistoryPresenter';


const CoachAllocateHistoryPage = ({navigation, route})=>{

    const { history } = route.params;

    const [historyArr, setHistoryArr] = useState([]);

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

    const loadHistory = async () => {
        try{
            changeLoadingVisible(true);
            await new DisplayAllocateHistoryPresenter({updateHistory: setHistoryArr}).displayAllocationHistory(history.id);
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
            day: 'numeric',
        });
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return(
        <View style ={styles.container}>
            <Text style = {styles.title}>HISTORY</Text>

            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>

            <ScrollView contentContainerStyle = {styles.scrollView}>
                { historyArr.length === 0 ? 
                <Text style = {styles.noTitle}>No Fitness Plan Allocated</Text> 
                : 
                historyArr.map((plan, index) => {
                    console.log(plan.plan);
                    return(
                        <View style = {styles.planItem} key = {index}>
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
                                            <Image source = {require('../../../assets/clock_icon.png')} style = {styles.icon}/>
                                            <Text>{plan.details.routinesList.length * plan.plan.repetition} Days</Text>
                                        </View>
                                        <View style = {styles.stats}>
                                            <Image source = {require('../../../assets/fire_icon.png')} style = {styles.icon}/>
                                            <Text>{Math.ceil(plan.details.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0)) * plan.plan.repetition} kcal</Text>
                                        </View>
                                    </View>

                                </View>
                            }
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    title:{
        fontSize: scale(28),
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        marginTop: scale(10),
        textAlign: 'center',
        paddingVertical: scale(10),
    },
    scrollView:{
    },
    noTitle:{
        fontSize: scale(20),
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        marginTop: scale(10),
        textAlign: 'center',
        paddingVertical: scale(10),
    },
    planItem:{
        borderColor: 'lightgray',
        borderWidth: 1,
        flexDirection: 'row',
        padding: scale(10),
        gap: scale(25),
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
    icon:{
        width: scale(15),
        height: scale(15),
    
    },
});

export default CoachAllocateHistoryPage;