import { View, Text, StyleSheet, Modal, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";

import DisplayPlanAllocationPresenter from '../../presenter/DisplayPlanAllocationPresenter';

const CoachAllocatePlanPage = ({navigation, route}) => {

    const { user } = route.params;

    const [onProgress, setOnProgress] = useState([]);

    // console.log(user);
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

    const loadPlanAllocation = async () => {
        try{
            changeLoadingVisible(true);
            await new DisplayPlanAllocationPresenter({updateOnProgress: setOnProgress}).displayPlanAllocation(user.id);
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    useEffect(() => {
        loadPlanAllocation();
    }, []);


    return (
        <View style={styles.container}>

            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>

            <ScrollView contentContainerStyle = {styles.planView}>
                <View style = {styles.allocateContainer}>
                    <Text style = {styles.titleText}>Allocate Plan</Text>
                    <TouchableOpacity onPress={()=>console.log('go')}  style = {styles.addPlanButton}>
                        <Image style = {styles.icon} source = {require('../../../assets/add_box_icon.png')} />
                    </TouchableOpacity>
                </View>

                {onProgress.length === 0 ? null :
                <View style = {styles.onProgressContainer}>
                    <Text style = {styles.titleText}>On Progress</Text>
                    {
                        onProgress.map((plan, index) => {
                            console.log(plan);
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
                                        <Text>{`${plan.plan.startDate.toDateString()} - ${plan.plan.endDate.toDateString()}`}</Text>
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
                <TouchableOpacity style = {styles.viewHistoryButton} onPress={() => navigation.navigate('CoachAllocateHistoryPage', {user})}>
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
        backgroundColor: 'red',
        paddingHorizontal: scale(15),
    },
    onProgressContainer:{
    },
    historyContainer:{
        backgroundColor: 'green',
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
    statsIcon:{
        width: scale(15),
        height: scale(15),
    
    },

});

export default CoachAllocatePlanPage;