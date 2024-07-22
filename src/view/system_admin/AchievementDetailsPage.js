
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { scale } from '../../components/scale';


import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";
import DisplayAchievementPresenter from '../../presenter/DisplayAchievementPresenter';
import DeleteAchievementPresenter from '../../presenter/DeleteAchievementPresenter';

const AchievementDetailsPage = ({navigation, route}) => {
    const { achievementID } = route.params;
    const [achievement, setAchievement] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');


    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    const getAchievement = async () => {
        try{
            changeLoadingVisible(true);
            await new DisplayAchievementPresenter({displayAchievement: setAchievement, achievementID: achievementID}).displayAchievement();
            
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    const onPressDelete = async () => {
        try{
            changeLoadingVisible(true);
            await new DeleteAchievementPresenter({achievement: achievement}).deleteAchievement();
            navigation.navigate('AchievementsPage', {refresh: true});
        }catch(e){
            changeModalVisible(true, e.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    useEffect(()=>{
        getAchievement();
    }, []);

    return (
        <View style={styles.container}>
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
                action = {onPressDelete}
                />
            </Modal>

            <View style = {styles.titleView}>
                <Text style={styles.title}>{achievement ? achievement.achievementName : ''}</Text>
            </View>

            {achievement ? (
                <Image source={{uri:achievement.achievementPicture}} style={styles.icon} />
            ) : (
                <View style={styles.icon} />
            )}
                
            <View style ={styles.detailsView}>
                <Text style={styles.detailsTitle}>Achievement Description:</Text> 
                <Text style ={styles.detailsInput}>{achievement ? achievement.description : ''}</Text>

                <Text style={styles.detailsTitle}>Type:</Text>
                <Text style={styles.detailsInput}>{achievement ? achievement.achievementType : ''}</Text>
                
                <Text style={styles.detailsTitle}>Achievement Target:</Text>
                <Text style={styles.detailsInput}>{achievement ? achievement.maxProgress+(achievement.achievementType === 'Running' ? ' meter' : '') : ''}</Text>
            </View>

            <View style = {styles.buttonsView}>
                <TouchableOpacity style = {styles.edit} onPress = {()=>navigation.navigate('EditAchievementPage', {achievement})}>
                    <Text style ={styles.buttonText}>EDIT</Text>
                </TouchableOpacity>

                <TouchableOpacity style = {styles.delete} onPress = {()=>changeConfirmVisible(true, 'Are you sure you want to delete this achievement?')}>
                    <Text style = {styles.buttonText}>DELETE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
        alignItems: 'center',
    },
    icon: {
        width: scale(200),
        height: scale(200),
        marginBottom: scale(25),
    },
    titleView:{
        width: scale(200), 
        height: scale(100), 
        justifyContent:'center'
    },
    title: {
        textAlign: 'center',

        fontFamily: 'Poppins-SemiBold',
        fontSize: scale(25),
    },
    detailsTitle: {
        alignSelf: 'flex-start',
        fontSize: scale(17),
        fontWeight: 'bold',
    },
    detailsView:{
        width: '85%',
    },
    detailsInput: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: scale(10),
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: scale(20),
      },
      buttonsView: {
        width: '85%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(20),
      },
      edit:{
        width: scale(120),
        height: scale(40),
        backgroundColor: '#E28413',
        padding: scale(10),
        borderRadius: 5,
        alignItems: 'center',
      },
      delete:{
        width: scale(120),
        height: scale(40),
        backgroundColor: '#C42847',
        padding: scale(10),
        borderRadius: 5,
        alignItems: 'center',
      },
      buttonText:{
        color:'white',
        fontSize: scale(16),
        fontWeight: 'bold',
        fontFamily:'Inter'
      }
});

export default AchievementDetailsPage;