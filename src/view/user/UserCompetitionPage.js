import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import DisplayCompetitionsPresenter from '../../presenter/DisplayCompetitionsPresenter';

const UserCompetitionPage = ({ navigation, route }) => {
    const { user } = route.params;

    const [myCompetitions, setMyCompetitions] = useState([]);
    const [participatedCompetitions, setParticipatedCompetitions] = useState([]);

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
        console.log(date.toLocaleString());
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
            await new DisplayCompetitionsPresenter({updateMyCompetitions: setMyCompetitions, updateParticipatedCompetitions: setParticipatedCompetitions}).loadCompetitions(user.accountID);
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Competitions</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate("UserCreateCompetitionPage", { user })
                }>
                    <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() =>
                    console.log('Invite')
                }>
                    <Text style={styles.buttonText}>Invitation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate("UserCompetitionHistoryPage", { user })
                }>
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.competitionContainer}>
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
                                        <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {formatDate(competition.startDate)}</Text>
                                        <Text style = {styles.competitionDateTitle}>End Date:</Text>
                                        <Text style = {[styles.competitionDateTitle, {fontFamily:'Inter'}]}>    {formatDate(competition.endDate)}</Text>
                                    </View>
                                    <View style = {styles.competitionDateButtonsView}>
                                        <TouchableOpacity onPress = {()=>{console.log('details')}} style = {[{backgroundColor: '#E28413'}, styles.competitionDateButtons]}>
                                            <Text style ={[styles.competitionDateTitle, {textAlign:'center', color:'white'}]}>View Details</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress = {()=>{console.log('leave')}} style = {[{backgroundColor: '#BA0000'}, styles.competitionDateButtons]}>
                                            <Text style ={[styles.competitionDateTitle, {textAlign:'center', color:'white'}]}>Leave</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style = {styles.progressView}>
                                    <View style = {styles.progress}>
                                        <Text style = {styles.progressText}>Progress: </Text>
                                        {
                                            competition.competitionType.competitionTypeID === 1 ?
                                            <Text style = {styles.progressText}>0%</Text> : null
                                        }
                                        
                                        {
                                            competition.competitionType.competitionTypeID === 2 ?
                                            <>
                                                <Text style = {styles.progressText}>0</Text>
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
                            <View key={index}>
                                <Text>{competition.competitionName}</Text>
                            </View>
                        );
                    })}
                    </>
                }
            </View>
        </ScrollView>
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
    },
    competitionView:{
        width: '100%',
        marginBottom: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: scale(8),
    },
    progressView:{
        width: '45%',
    },
    progress:{
        backgroundColor: 'white',
        borderTopRightRadius: scale(8),
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: scale(175),
    },
    progressTopBottomText:{
        fontSize: scale(16),
        color: 'white',
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderBottomRightRadius: scale(8),
        
    },
    competitionDetailsView:{
        width: '55%',
        padding: scale(8),
        backgroundColor:'#D9D9D9',

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
    },
    progressText:{
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',
    }
});


export default UserCompetitionPage;