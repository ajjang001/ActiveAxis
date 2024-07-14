
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { scale } from '../../components/scale';


import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";
import DisplayAchievementPresenter from '../../presenter/DisplayAchievementPresenter';


const AchievementDetailsPage = ({navigation, route}) => {
    const { achievementID } = route.params;
    const [achievement, setAchievement] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setModalVisible(b);
    }

    const changeLoadingVisible = (b)=>{
        setIsLoading(b);
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
                <Text style={styles.detailsInput}>{achievement ? achievement.competitionType : ''}</Text>
                
                <Text style={styles.detailsTitle}>Achievement Target:</Text>
                <Text style={styles.detailsInput}>{achievement ? achievement.maxProgress+(achievement.competitionType === 'Running' ? ' meter' : '') : ''}</Text>
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
});

export default AchievementDetailsPage;