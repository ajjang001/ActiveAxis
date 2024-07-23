import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView, Modal} from 'react-native';
import axios from 'axios';

import AccountListCard from '../../components/AccountListCard';
import DisplayCoachRegistrationPresenter from '../../presenter/DisplayCoachRegistrationPresenter';
import { scale } from '../../components/scale';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

const CoachRegistrationListPage = ({route, navigation}) =>{
    // state variables
    const [coaches, setCoaches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');


    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

   
    const loadCoachRegistrationList = async () => {
        try{
            changeLoadingVisible(true);
            await new DisplayCoachRegistrationPresenter({updateCoachList: setCoaches}).displayListOfCoachRegistration();
            changeLoadingVisible(false);
        }catch(error){
            changeModalVisible(true, error.message);
        }
    }

    useEffect(()=>{
        if (route.params?.refresh){
            loadCoachRegistrationList();
            route.params.refresh = false;
        }
    },[route.params?.refresh]);

    useEffect(()=>{
        loadCoachRegistrationList();  
    }, []);

    return (
        <View style = {styles.container}>
            <View style = {styles.headerView}>
                <Text style = {styles.headerText}>Coach Registration List</Text>
            </View>

            
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>

                <ScrollView contentContainerStyle = {styles.contentView}>
                {coaches.length == 0 ? 
                            <View>
                                <Text style = {{color:'white', fontSize: scale(20)}}>No Coach Registration Found</Text>
                            </View> 
                            
                            :

                            coaches.map((coach, index)=>{
                                return(
                                    <AccountListCard 
                                    key = {index}
                                    numOfButtons = {1}
                                    account = {coach.coach}
                                    detailsHandler = {()=>{navigation.navigate('CoachRegistrationDetailsPage',{coach})}}
                                    isAdminView = {true}
                                    />
                                );
                            })}
                            

                </ScrollView>
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C42847',
        alignItems: 'center',
    },
    headerView:{
        backgroundColor: '#E28413',
        width: '100%',
        height: '10%',
    },
    headerText:{
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(20),
    },
    contentView:{
        width: '100%',
        height: '100%',
        padding: scale(35),
        
    }
});

export default CoachRegistrationListPage;