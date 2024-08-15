import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import DisplayCompetitionHistoryPresenter from '../../presenter/DisplayCompetitionHistoryPresenter';
import ObtainAchievementPresenter from '../../presenter/ObtainAchievementPresenter';
import ShareCompetitionPresenter from '../../presenter/ShareCompetitionPresenter';

const UserCompetitionHistoryPage = ({ route, navigation }) => {

    const { user } = route.params;

    const [competitions, setCompetitions] = useState([]);

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

    // Date formatter
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleString('en-US', {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const loadCompetitions = async () => {
        try{
            changeLoadingVisible(true);
            setCompetitions([]);
            await new DisplayCompetitionHistoryPresenter({updateCompetitions: setCompetitions}).getCompetitionHistory(user.accountID);
        }catch(err){
            console.log(err);
            changeModalVisible(true, err.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const checkCompetitionAchievements = async() =>{
        try{
            const justObtainedAchievements = await new ObtainAchievementPresenter().checkAchievementCompetition(user.accountID, competitions);
        
            if(justObtainedAchievements){
                if(justObtainedAchievements.length > 0){
                    for(let i = 0; i < justObtainedAchievements.length; i++){
                        Alert.alert('Achievement Unlocked', justObtainedAchievements[i]);
                    }
                }
            }
            
        }catch(err){
            console.log(err);
            changeModalVisible(true, err.message.replace('Error: ', ''));
        }
    }

    const handleShare = async (competition) => {
        try{
            await new ShareCompetitionPresenter().shareCompetition(competition);
        }catch(err){
            changeModalVisible(true, err.message.replace('Error: ', ''));
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadCompetitions();
        }, [])
    );

    useEffect(() => {
        if(competitions.length > 0){
            checkCompetitionAchievements();
        }
    }, [competitions]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>History</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>

            <ScrollView contentContainerStyle={styles.competitionContainer}>
                {
                    competitions.length <= 0 ?
                    <Text style = {styles.noAvailableText}>No Competition History Available</Text>:
                    <>
                        {
                            competitions.map( (competition, index) => {
                                return (
                                    <View style = {styles.competitionView} key={index}>
                                        <View style = {styles.competitionDetailsView}>
                                            <Text style = {styles.competitionTitleText}>{competition.competition.competitionName}</Text>
                                            <View style = {styles.competitionDateView}>
                                                <Text style = {styles.competitionDateTitle}>Type:</Text>
                                                <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {competition.competition.competitionType.competitionTypeName}</Text>
                                                <Text style = {styles.competitionDateTitle}>Start Date:</Text>
                                                <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {formatDate(competition.competition.startDate.toDate())}</Text>
                                                <Text style = {styles.competitionDateTitle}>End Date:</Text>
                                                <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {formatDate(competition.competition.endDate.toDate())}</Text>
                                            </View>
                                            <View style = {styles.competitionDateButtonsView}>
                                                <TouchableOpacity onPress = {()=>{navigation.navigate('UserCompetitionDetailsPage', {user, competition: competition.competition})}} style = {[{backgroundColor: '#E28413'}, styles.competitionDateButtons]}>
                                                    <Text style ={[styles.competitionDateTitle, {textAlign:'center', color:'white'}]}>View Details</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress = {()=>{handleShare(competition)}} style = {[{backgroundColor: 'black'}, styles.competitionDateButtons]}>
                                                    <Text style ={[styles.competitionDateTitle, {textAlign:'center', color:'white'}]}>Share Result</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style = {styles.progressView}>
                                            <View style = {styles.progress}>
                                                <Text style = {styles.progressText}>Your Ranking: </Text>
                                                <Text style = {[styles.progressText, {fontSize:scale(32)}]}>#{competition.position}</Text>
                                            </View>
                                            <Text style = {styles.progressTopBottomText}>{competition.competition.participants.length} Participants</Text>
                                        </View>
                                    </View>
                                );
                            }

                            )
                        }
                    </>
                }
            </ScrollView>
        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
    },
    headerContainer: {
        width: '95%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(10),
    },
    competitionContainer: {
        width: '95%',
        marginTop: scale(8),
    },
    competitionView:{
        width: '100%',
        marginBottom: scale(16),
        flexDirection: 'row',
        borderRadius: scale(8),
        backgroundColor: 'white',  
    },
    competitionDetailsView:{
        width: '60%',
        padding: scale(8),
        backgroundColor:'#D9D9D9',
        borderTopLeftRadius: scale(8),
        borderBottomLeftRadius: scale(8),

    },
    competitionTitleText:{
        fontSize: scale(16),
        fontFamily: 'Inter-SemiBold',
        backgroundColor: 'white',
        paddingHorizontal: scale(8),
        
    },
    competitionDateView:{
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: scale(8),
        backgroundColor: 'white',
        paddingHorizontal: scale(8),
    },
    competitionDateTitle:{
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(14),
    },
    competitionDateButtonsView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    competitionDateButtons:{
        width: '45%',
        marginTop: scale(8),
        borderRadius: scale(6),
    },
    progressView:{
        width: '40%',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderBottomRightRadius: scale(8),
        borderTopRightRadius: scale(8),
    },
    progress:{
        backgroundColor: 'white',
        borderTopRightRadius: scale(8),
        height: scale(175),
        justifyContent: 'center',
    },
    progressText:{
        fontSize: scale(18),
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
    },
    progressTopBottomText:{
        fontSize: scale(16),
        color: 'white',
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        
    },
    noAvailableText:{
        paddingVertical: scale(32),
        fontSize: scale(18),
        fontFamily: 'Inter-SemiBold',

    }
});


export default UserCompetitionHistoryPage;