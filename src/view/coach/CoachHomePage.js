// src/view/coach/CoachHomePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, ScrollView, Modal, BackHandler } from 'react-native';
import { scale } from '../../components/scale';

import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';
import { TouchableOpacity } from 'react-native-gesture-handler';

import DisplayListOfFitnessPlanPresenter from "../../presenter/DisplayListOfFitnessPlanPresenter";
import { useFocusEffect } from '@react-navigation/native';



const CoachHomePage = ({ navigation, route }) => {
    
    const { coach } = route.params;
    
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
    
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                return true;  
            };
    
            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
            return () => backHandler.remove();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            loadFitnessPlans();
            route.params.refresh = false;
        }, [route.params?.refresh])
    );
    

    return (
        <ScrollView contentContainerStyle={styles.pageContainer}>
            <View style = {styles.titleView}>
                <Text style = {styles.homeTitle}>Welcome Back,</Text>
                <Text style = {styles.homeSubTitle}>{coach.fullName ? coach.fullName : 'Coach Name'}</Text>
            </View>

            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>

            
            <View style = {styles.planDirectView}>
                <TouchableOpacity onPress = {()=>navigation.navigate('CoachListOfFitnessPlansPage', {coach})} style = {styles.planDirectButton}>
                    <ImageBackground imageStyle = {styles.imageStyle} resizeMode='stretch' source={require('../../../assets/plan_button_img.png')} >
                        <View style = {styles.buttonTextView}>
                            <Text style={styles.planDirectButtonText}>My Fitness Plans</Text>      
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>

            <View style = {styles.recentlyChangedContainer}>
                <Text style = {styles.recentlyChangedTitle}>RECENTLY CHANGED</Text>
                    <View style = {styles.listOfPlansContentContainer}>
                        {
                            fitnessPlans.sort((a,b)=>new Date(b.lastUpdated) - new Date(a.lastUpdated)).slice(0, 4).map((fitnessPlan, index) => {

                                return (
                                    
                                        <TouchableOpacity style = {styles.planContainer} key = {index} 
                                        onPress = {()=>{navigation.navigate("CoachFitnessPlanPage", {coach, fitnessPlan})}}
                                        // onPress = {()=>navigation.navigate('CoachListOfFitnessPlansPage', {coach})}
                                        >
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
                                                        <Text>{Math.ceil(fitnessPlan.routinesList.map(routine => routine.estCaloriesBurned).reduce((a,b)=>a+b,0))} kcal</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                );
                            })
                        }
                    </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    titleView:{
        backgroundColor: '#C42847',
        paddingHorizontal: scale(20),
        paddingTop: scale(72),
        paddingBottom: scale(16),
    },
    homeTitle:{
        fontSize: scale(24),
        fontFamily: 'Poppins',
        color: 'white'
    },
    homeSubTitle:{
        fontSize: scale(32),
        fontFamily: 'Poppins-SemiBold',
        color: 'white'
    },
    planDirectView:{
        width: '100%',
        height: scale(150),
        justifyContent: 'center',
        paddingTop: scale(16)
    },
    planDirectButton:{
        marginHorizontal: scale(20),
    },
    imageStyle:{
        borderRadius:scale(20)
    },
    buttonTextView:{
        height:scale(120),
        justifyContent: 'center',
        borderWidth: scale(1),
        borderColor: '#808080',
        borderRadius: scale(20),
    },
    planDirectButtonText:{
        paddingHorizontal: scale(20),
        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(20),
        textAlign:'right',
    },
    recentlyChangedContainer:{
        paddingVertical: scale(32),
    },
    listOfPlansContentContainer:{
        paddingHorizontal: scale(10),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: scale(16),
    },
    recentlyChangedTitle:{
        fontSize: scale(24),
        fontFamily: 'Poppins-SemiBold',
        marginBottom: scale(8),
        paddingHorizontal: scale(16),
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

export default CoachHomePage;
