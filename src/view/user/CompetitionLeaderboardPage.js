import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, ScrollView, Modal } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';

import DisplayLeaderboardPresenter from '../../presenter/DisplayLeaderboardPresenter';

import { LoadingDialog, MessageDialog } from '../../components/Modal';

const CompetitionLeaderboardPage = ({route, navigation}) => {
    const { user, competition } = route.params;

    const [leaderboard, setLeaderboard] = useState([]);
    

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }
    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeConfirmVisible = (b, m)=>{
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    const getLeaderboard = async () => {
        try{
            changeLoadingVisible(true);
            setLeaderboard([]);
            await new DisplayLeaderboardPresenter({updateLeaderboard: setLeaderboard}).getLeaderboard(competition.competitionID);
        }catch(error){
            console.log(error);
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
    }

    useEffect(()=>{
        getLeaderboard();
    }, []);
    return(
        <View style = {styles.container}>
            <View style = {styles.leaderboardContainer}>
                <Text style = {styles.header}>Leaderboard</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style = {styles.leaderboardView}>
                    {
                        leaderboard.length > 0 ?
                        leaderboard.map((l, i) => (
                            <View key = {i} style = {styles.leaderboardParticipantView}>
                                <Text style={[styles.detailsText,{fontSize:scale(24)}]}>{i+1}</Text>
                                <View style = {[styles.participantDetails, l.participant.accountID === user.accountID ? {opacity: 1} : null]}>
                                    <View style = {{flexDirection:'row', alignItems:'center', gap:scale(16)}}>
                                        <Image source = {{uri: l.participant.profilePicture}} style = {{width: scale(50), height: scale(50), borderRadius: scale(50)}} />
                                        <Text style={styles.detailsText}>{l.participant.fullName}</Text>
                                    </View>
                                    <Text style={styles.detailsText}>{l.userProgress}</Text>
                                </View>
                            </View>
                        )) :
                        <Text style = {styles.loading}>Loading...</Text>
                    }
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBF5F3',
    },
    leaderboardContainer:{
        backgroundColor:'#E28413',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scale(24),
        paddingHorizontal: scale(16),
    },
    header:{
        fontSize: scale(32),
        fontFamily: 'League-Spartan-SemiBold',
    },
    scrollView:{
        backgroundColor: '#C42847',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingVertical: scale(16),
    },
    leaderboardView:{
        width: '90%',
        gap: scale(16),
        flexDirection: 'column',
        alignItems: 'center',
    },
    leaderboardParticipantView:{
        flexDirection:'row',
        gap: scale(32),
        alignItems: 'center',
        
    },
    participantDetails:{
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '90%',
        paddingVertical: scale(8),
        paddingHorizontal: scale(16),
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: scale(16),
        borderWidth: 1,
        opacity: 0.7,
    },
    detailsText:{
        fontSize: scale(16),
        fontFamily: 'Inter-SemiBold',
    },
    loading:{
        fontSize: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: 'white',
        paddingVertical: scale(16),
    }
});

export default CompetitionLeaderboardPage;