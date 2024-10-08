import React, {useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, BackHandler} from 'react-native';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import {scale} from '../../components/scale';
import LogoutPresenter from '../../presenter/LogoutPresenter';
import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';

const SystemAdminHomePage = ({navigation, route}) => {
    // Get the admin from the route params
    const [admin, setAdmin] = useState(route.params.admin !== undefined ? route.params.admin : null);

    // State to control the visibility of the modal
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');


    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // Function to log out the user
    const onPressLogout = async () =>{
        changeLoadingVisible(true);
        try{
            await new LogoutPresenter({getAccount: admin, setAccount: setAdmin}).logoutAccount();
            navigation.dispatch(
                StackActions.replace('LoginPage', null, { ...TransitionPresets.SlideFromRightIOS })
            );
            
        }catch(error){
            changeModalVisible(true, error.message);
        }finally{
            changeLoadingVisible(false);
        }
        
        
    }

    // Reset the state when the component gains focus
    useFocusEffect(
        useCallback(() => {
            // Reset state when the component gains focus
            return () => {
                setAdmin(route.params.admin !== undefined ? route.params.admin : null);
                setModalVisible(false);
            };
        }, [route.params.admin])
    );

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                return true;  
            };
    
            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
            return () => backHandler.remove();
        }, [])
    );

    // Options for the system admin
    const options = [
        {label: 'Account Settings', onPress: () => navigation.navigate('SystemAdminAccountSettingPage', {admin}) },
        {label: 'Achievements', onPress: () => navigation.navigate('AchievementsPage')},
        {label: 'User Account List', onPress: () => navigation.navigate('UserAccountListPage')},
        {label: 'App Details', onPress: () => navigation.navigate('SystemAdminAppDetails')},
        {label: 'App Feedbacks', onPress: () => navigation.navigate('SystemAdminAppFeedbacks')},
        {label: 'Coach', onPress: () => navigation.navigate('CoachAccountListPage')},
        {label: 'Log Out', onPress: () => changeConfirmVisible(true, 'Are you sure you want to log out?')}
    ];

    return (
        <ScrollView style = {styles.container}>
            {admin && (
                <View style={styles.textContainer}>
                    <Text style={styles.topText}>{admin.username}</Text>
                    <Text style={styles.topText}>{admin.email}</Text>
                </View>
            )}

            {
                options.map((option, index) => (
                    <TouchableOpacity key={index} style = {styles.optionButton} activeOpacity={0.8} onPress = {option.onPress}>
                        <Text style = {styles.buttonText}>{option.label}</Text>
                    </TouchableOpacity>
                ))
                
            }

                <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeConfirmVisible(false)}>
                    <ActionDialog
                    message = {confirmMessage}
                    changeModalVisible = {changeConfirmVisible}
                    action = {onPressLogout}
                    />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                    <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
                </Modal>


            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#C42847',
        marginTop: scale(50),
    },
    textContainer:{
        padding: scale(30),
    }
    ,
    topText:{
        fontFamily:'Inter-SemiBold',
        fontSize: scale(20),
        color: 'white',
    },
    optionButton:{
        borderWidth: scale(1),
        backgroundColor: '#D9D9D9',
        marginBottom: scale(10),
        width: '100%',


    },
    buttonText:{
        fontFamily:'League-Spartan-Light',
        fontSize: scale(25),
        padding: scale(15),
        paddingVertical: scale(25),


    }
});


export default SystemAdminHomePage;