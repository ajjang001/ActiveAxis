import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { scale } from "../../components/scale";
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import DisplayListOfFitnessPlanPresenter from "../../presenter/DisplayListOfFitnessPlanPresenter";

const CoachListOfFitnessPlansPage = ({navigation, route}) => {

    const {coach} = route.params;
    

    const [fitnessPlans, setFitnessPlans] = useState([]);

    
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

    const loadFitnessPlans = async() =>{
        try{
            changeLoadingVisible(true);
            setFitnessPlans([]);
            await new DisplayListOfFitnessPlanPresenter({updateList: setFitnessPlans}).getFitnessPlans(coach.accountID);
    
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    // useEffect(() => {
    //     loadFitnessPlans();
    // }, []);

    useEffect(() => {
        loadFitnessPlans();
    }, [route.params?.refresh]);

    return (
        <View style = {styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            <Text style = {styles.titleText}>Fitness Plan</Text>
            
            <View style = {styles.topHeaderView}>
                
                <View style = {styles.createButtonView}>
                    <TouchableOpacity onPress = {()=>navigation.navigate('CoachCreateFitnessPlanPage', {coach})} style = {styles.createButton}>
                        <Text style = {styles.createText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.listOfPlansContentContainer}>
                {
                    fitnessPlans.map((fitnessPlan, index) => {

                        return (
                            
                                <TouchableOpacity style = {styles.planContainer} key = {index} onPress = {()=>{navigation.navigate("CoachFitnessPlanPage", {coach, fitnessPlan})}}>
                                    <Image source = {{uri: fitnessPlan.fitnessPlanPicture}} resizeMode="cover" style = {styles.image}/>
                                    <View style = {styles.detailsContainer}>
                                        <Text style = {{paddingHorizontal:scale(10)}}>{fitnessPlan.fitnessPlanName}</Text>
                                        <View style = {styles.statsView}>
                                            <View style = {styles.stats}>
                                                <Image source = {require('../../../assets/clock_icon.png')} style = {styles.icon}/>
                                                <Text>{fitnessPlan.routinesList.length} Days</Text>
                                            </View>
                                            <View style = {styles.stats}>
                                                <Image source = {require('../../../assets/fire_icon.png')} style = {styles.icon}/>
                                                <Text>{fitnessPlan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0)} kcal</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    titleText:{
        fontSize: scale(35),
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        
    },
    topHeaderView:{
        width: '100%',
        backgroundColor: '#C42847',
        height: scale(40),
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: scale(10),

    },
    createButtonView:{
        height: scale(40), 
        backgroundColor:'#FBF5F3', 
        justifyContent:'center',
        paddingHorizontal: scale(40),
    },
    createButton:{
        backgroundColor: '#E28413',
        width: scale(120),
        borderRadius: 15,
        padding: scale(2),
        
    },
    createText:{
        fontSize: scale(18),
        fontFamily: 'League-Spartan-SemiBold',
        color: 'white',
        textAlign: 'center',
        
    },
    listOfPlansContentContainer:{
        padding: scale(15),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: scale(15),
        
    },
    planContainer:{
        width:scale(215), 
        backgroundColor:'white', 
        borderRadius:10
    },
    image:{
        width: scale(215), 
        height: scale(125), 
        borderRadius:10
    },
    detailsContainer:{
        padding: scale(5),
    },
    icon:{
        width: scale(15),
        height: scale(15),
    
    },
    statsView:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: scale(5),
    },
    stats:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(5),
    }

});

export default CoachListOfFitnessPlansPage;