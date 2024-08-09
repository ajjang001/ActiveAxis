import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import DisplayCompetitionsPresenter from '../../presenter/DisplayCompetitionsPresenter';
import LeaveCompetitionPresenter from '../../presenter/LeaveCompetitionPresenter';
import DeleteCompetitionPresenter from '../../presenter/DeleteCompetitionPresenter';
import DisplayCompetitionProgressPresenter from '../../presenter/DisplayCompetitionProgressPresenter';

const UserCompetitionPage = ({ navigation, route }) => {
    const { user } = route.params;


    const [myCompetitions, setMyCompetitions] = useState([]);
    const [participatedCompetitions, setParticipatedCompetitions] = useState([]);
    const [progress, setProgress] = useState([]);
    const [participatedProgress, setParticipatedProgress] = useState([]);

    const [selectedCompetition, setSelectedCompetition] = useState(null);
    const [isLeave, setIsLeave] = useState(false);

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
            setMyCompetitions([]);
            setParticipatedCompetitions([]);
            setProgress([]);
            setParticipatedProgress([]);
            await new DisplayCompetitionsPresenter({updateMyCompetitions: setMyCompetitions, updateParticipatedCompetitions: setParticipatedCompetitions}).loadCompetitions(user.accountID);
        }catch(error){
            console.log(error);
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }
    const loadProgress = async () => {
        try{
            changeLoadingVisible(true);
            await new DisplayCompetitionProgressPresenter({updateProgress: setProgress, updateParticipatedProgress: setParticipatedProgress}).getUserCompetitionProgress(user.accountID, myCompetitions, participatedCompetitions);
        }catch(error){
            console.log(error);
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    const handleLeave = async (userID, competitionID) => {
        try{
            changeLoadingVisible(true);
            await new LeaveCompetitionPresenter().leaveCompetition(userID, competitionID);
            changeModalVisible(true, 'Successfully left the competition');
            await loadCompetitions();
            
        }catch(error){
            console.log(error);
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeConfirmVisible(false);
        }
    }

    const handleDelete = async (competitionID) => {
        try{
            changeLoadingVisible(true);
            await new DeleteCompetitionPresenter().deleteCompetition(competitionID);
            changeModalVisible(true, 'Successfully deleted the competition');
            await loadCompetitions();
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }


    useFocusEffect(
        useCallback(() => {
            loadCompetitions();
        }, [])
    );

    useEffect(() => {
        
        if(myCompetitions.length > 0 || participatedCompetitions.length > 0){
            loadProgress();
        }
    }, [myCompetitions, participatedCompetitions]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Competitions</Text>
            </View>
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
                    action = { isLeave ? ()=>{handleLeave(user.accountID, selectedCompetition.competitionID)} : ()=>{handleDelete(selectedCompetition.competitionID)} }
                />
            </Modal>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate("UserCreateCompetitionPage", { user })
                }>
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate("UserCompetitionInvitationPage", { user })
                }>
                    <Text style={styles.buttonText}>Invitation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate("UserCompetitionHistoryPage", { user })
                }>
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.competitionContainer}>
                {
                    myCompetitions.length <= 0 && participatedCompetitions.length <= 0 ?
                    <Text style = {styles.noAvailableText}>No Competitions Available</Text>
                    : null
                }
                {
                    myCompetitions.length <= 0 ? null :
                    <>
                    <Text style = {styles.titleText}>My Competitions</Text>
                    {myCompetitions.map((competition, index) => {
                        return (
                            <View style = {styles.competitionView} key={index}>
                                
                                <View style = {styles.competitionDetailsView}>
                                    <Text style = {styles.competitionTitleText}>{competition.competitionName}</Text>
                                    <View style = {styles.competitionDateView}>
                                        <Text style = {styles.competitionDateTitle}>Type:</Text>
                                        <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {competition.competitionType.competitionTypeName}</Text>
                                        <Text style = {styles.competitionDateTitle}>Start Date:</Text>
                                        <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {formatDate(competition.startDate.toDate())}</Text>
                                        <Text style = {styles.competitionDateTitle}>End Date:</Text>
                                        <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {formatDate(competition.endDate.toDate())}</Text>
                                    </View>
                                    <View style = {styles.competitionDateButtonsView}>
                                        <TouchableOpacity onPress = {()=>{navigation.navigate('UserCompetitionDetailsPage', {user, competition})}} style = {[{backgroundColor: '#E28413'}, styles.competitionDateButtons]}>
                                            <Text style ={[styles.competitionDateTitle, {textAlign:'center', color:'white'}]}>View Details</Text>
                                        </TouchableOpacity>
                                        {
                                            competition.startDate.toDate() > new Date() ?
                                            <TouchableOpacity onPress = {()=>{setSelectedCompetition(competition); setIsLeave(false); changeConfirmVisible(true, 'Are you sure you want to delete and cancel this competition?')}} style = {[{backgroundColor: '#BA0000'}, styles.competitionDateButtons]}>
                                                <Text style ={[styles.competitionDateTitle, {textAlign:'center', color:'white'}]}>Delete</Text>
                                            </TouchableOpacity>: null
                                        }
                                    </View>
                                </View>
                                <View style = {styles.progressView}>
                                    <View style = {styles.progress}>
                                        
                                        {
                                            progress.length !==0 && competition.competitionType.competitionTypeID === 1 ?
                                            <>
                                                <Text style = {styles.progressText}>Progress: </Text>
                                                <Text style = {styles.progressText}>{progress[index]/competition.target*100 ? (progress[index]/competition.target*100).toFixed(0): '--'}%</Text>
                                            </> 
                                            : null
                                            
                                        }
                                        
                                        {
                                            progress.length !==0 && competition.competitionType.competitionTypeID === 2 ?
                                            <>
                                                <Text style = {styles.progressText}>Progress: </Text>
                                                <Text style = {styles.progressText}>{progress[index] || '--'}</Text>
                                                <Text style = {[styles.progressText, {fontSize:scale(16)}]}>steps</Text>
                                            </>
                                            : null

                                        }
                                    </View>
                                    <Text style = {styles.progressTopBottomText}>{competition.participants.length} Participants</Text>
                                </View>

                            </View>
                        );
                    })}
                    </>
                    
                }

                {
                    participatedCompetitions.length <= 0 ? null :
                    <>
                    <Text style = {styles.titleText}>Participated Competitions</Text>
                    {participatedCompetitions.map((competition, index) => {
                        return (
                            <View style = {styles.competitionView} key={index}>
                                
                                <View style = {styles.competitionDetailsView}>
                                    <Text style = {styles.competitionTitleText}>{competition.competitionName}</Text>
                                    <View style = {styles.competitionDateView}>
                                        <Text style = {styles.competitionDateTitle}>Type:</Text>
                                        <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {competition.competitionType.competitionTypeName}</Text>
                                        <Text style = {styles.competitionDateTitle}>Start Date:</Text>
                                        <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {formatDate(competition.startDate.toDate())}</Text>
                                        <Text style = {styles.competitionDateTitle}>End Date:</Text>
                                        <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {formatDate(competition.endDate.toDate())}</Text>
                                    </View>
                                    <View style = {styles.competitionDateButtonsView}>
                                        <TouchableOpacity onPress = {()=>{navigation.navigate('UserCompetitionDetailsPage', {user, competition})}} style = {[{backgroundColor: '#E28413'}, styles.competitionDateButtons]}>
                                            <Text style ={[styles.competitionDateTitle, {textAlign:'center', color:'white'}]}>View Details</Text>
                                        </TouchableOpacity>
                                        {
                                            competition.startDate.toDate() > new Date() ?
                                            <TouchableOpacity onPress = {()=>{setSelectedCompetition(competition); setIsLeave(true); changeConfirmVisible(true, 'Are you sure you want to leave this competition?')}} style = {[{backgroundColor: '#BA0000'}, styles.competitionDateButtons]}>
                                                <Text style ={[styles.competitionDateTitle, {textAlign:'center', color:'white'}]}>Leave</Text>
                                            </TouchableOpacity>: null

                                        }
                                        
                                    </View>
                                </View>
                                <View style = {styles.progressView}>
                                    <View style = {styles.progress}>
                                        
                                        {
                                            competition.competitionType.competitionTypeID === 1 ?
                                            <>
                                                <Text style = {styles.progressText}>Progress: </Text>
                                                <Text style = {styles.progressText}>{ participatedProgress[index]/competition.target*100 ? (participatedProgress[index]/competition.target*100).toFixed(0):'--'}%</Text> 
                                            </>
                                            : null
                                        }
                                        
                                        {
                                            competition.competitionType.competitionTypeID === 2 ?
                                            <>
                                                <Text style = {styles.progressText}>Progress: </Text>
                                                <Text style = {styles.progressText}>{participatedProgress[index] || '--'}</Text>
                                                <Text style = {[styles.progressText, {fontSize:scale(16)}]}>steps</Text>
                                            </>
                                            : null
                                        }
                                    </View>
                                    <Text style = {styles.progressTopBottomText}>{competition.participants.length} Participants</Text>
                                </View>

                            </View>
                        );

                    })}

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
        paddingTop: scale(70),
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
    buttonContainer: {
        width: '95%',
        flexDirection: 'row',
        paddingVertical: scale(8),
    },
    button: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingVertical: scale(5),
        marginTop: scale(10),
        flex: 1,
        marginHorizontal: scale(8),
        borderRadius: scale(8),

    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16),
    },
    competitionContainer: {
        width: '95%',
        marginTop: scale(8),
    },
    titleText:{
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',
        paddingVertical: scale(8),
    },
    competitionView:{
        width: '100%',
        marginBottom: scale(16),
        flexDirection: 'row',
        borderRadius: scale(8),
        backgroundColor: 'white',

        
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
    progressTopBottomText:{
        fontSize: scale(16),
        color: 'white',
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        
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
    progressText:{
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
    },
    noAvailableText:{
        paddingVertical: scale(32),
        fontSize: scale(18),
        fontFamily: 'Inter-SemiBold',

    }
});


export default UserCompetitionPage;