import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';
import CompetitionLeaderboard from '../../model/CompetitionLeaderboard';

import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import RemoveAdsPresenter from '../../presenter/RemoveAdsPresenter';

import DisplayCompetitionDetailsPresenter from '../../presenter/DisplayCompetitionDetailsPresenter';

const UserCompetitionDetailsPage = ({ navigation, route }) => {
    const { user, competition } = route.params;

    const [userDetails, setUserDetails] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    const [ads, setAds] = useState(null);

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

    const getAdsRemoved = async () => {
        try {
            setAds(await new RemoveAdsPresenter().isAdRemoved(user.accountID));
        } catch (error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    }

        useFocusEffect(
        useCallback(() => {
            getAdsRemoved();
        }, [])
    );

    const getUserInformation = async () => {
        try{
            changeLoadingVisible(true);
            setUserDetails([]);
            const ud = [];
            for(let i = competition.participants.length-1; i >= 0; i--){
                ud.push(await new DisplayCompetitionDetailsPresenter().getUserDetails(competition.participants[i]));
            }
            setUserDetails(ud);
            new CompetitionLeaderboard().initializeLeaderboard();
        }catch(error){
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }finally{
            changeLoadingVisible(false);
        }
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

    useEffect(() => {
        getUserInformation();
    }, []);

    return(
        <View style = {styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            
            <ScrollView contentContainerStyle ={styles.scrollView}>
                <View style={styles.detailsBox}>
                    {
                        (user.accountID === competition.host_user.accountID) && (competition.startDate.toDate() > new Date())
                        ? <View style = {styles.topButtonView}>
                            <TouchableOpacity onPress={()=>navigation.navigate('UserEditCompetitionPage', {user, competition})} style={styles.topButton}>
                                <Text style={styles.topButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.topButton} onPress={() => navigation.navigate('InviteFriendsCompetitionPage', {user, competitionID: competition.competitionID ,friendsInvited: competition.participants})}>
                                <Text style={styles.topButtonText}>Invite Friends</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    <Text style={styles.detailsTitle}>Competition Name</Text>
                    <Text style={styles.textInfoContainer}>{competition.competitionName}</Text>
                    
                    <Text style={styles.detailsTitle}>Type</Text>
                    <Text style={styles.textInfoContainer}>{competition.competitionType.competitionTypeName}</Text>

                    <Text style={styles.detailsTitle}>Start Date</Text>
                    <Text style={styles.textInfoContainer}>{formatDate(competition.startDate.toDate())}</Text>


                    <Text style={styles.detailsTitle}>End Date</Text>
                    <Text style={styles.textInfoContainer}>{formatDate(competition.endDate.toDate())}</Text>

                    {
                        competition.competitionType.competitionTypeID === 1 ?
                        <>
                            <Text style={styles.detailsTitle}>Target (steps)</Text>
                            <Text style={styles.textInfoContainer}>{competition.target} steps</Text>
                        </>
                            :
                            null
                    }

                    <Text style={styles.detailsTitle}>Details</Text>
                    <Text style={styles.textInfoContainer}>{competition.competitionDetails}</Text>

                    {
                        new Date() >= competition.startDate.toDate() ?
                        <View style ={styles.bottomButtonView}>
                            <TouchableOpacity style = {styles.topButton} onPress={() => navigation.navigate('CompetitionLeaderboardPage', {user, competition})}>
                                <Text style = {styles.topButtonText}>Leaderboard</Text>
                            </TouchableOpacity>
                        </View>: null

                    }

                    
                </View>
                {!ads && !isLoading && (
                <View style={styles.adContainer}>
                    <BannerAd
                        unitId={'ca-app-pub-3940256099942544/6300978111'} // Test ad unit ID
                        size={BannerAdSize.BANNER} // Adjust size as needed
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                        }}
                        onAdLoaded={() => {
                            console.log('Banner ad loaded');
                        }}
                        onAdFailedToLoad={(error) => {
                            console.error('Failed to load banner ad:', error);
                        }}
                    />
                </View>
            )}
                <View style = {styles.participantsView}>
                    <Text style ={styles.participantsViewTitleText}>Participants</Text>
                    {
                        
                        userDetails.map((u, index) => {
                            return(
                                <View style = {styles.participant} key={index}>
                                    <Text style = {styles.participantText}>{index+1}. {u.fullName} ~ {u.username} {u.accountID === user.accountID ? "(You)" : null} </Text>
                                    {
                                        competition.host_user.accountID === u.accountID ?
                                        <Image source={require('../../../assets/crown_icon.png')} style={{width: scale(20), height: scale(20), alignSelf: 'flex-end'}} />: null
                                    }
                                </View>
                            );
                        })       
                    }
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#FBF5F3',

    },
    scrollView:{
        width: '100%',  
        alignItems:'center'
    },
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(20),
        borderWidth: 2,
        borderRadius: scale(36),
        marginTop: scale(10),
        borderColor: '#C42847',
    },
    topButtonView:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: scale(8),
    },
    topButton: {
        width: '40%',
        backgroundColor: '#E28413',
        paddingVertical: scale(5),
        alignSelf: 'flex-end',
        marginBottom: scale(10),
        marginRight: scale(2),
        borderRadius: scale(8)
    },
    topButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
    detailsTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        marginVertical: scale(2),
    },
    textInfoContainer:{
        fontFamily: 'Inter',
        fontSize: scale(16),
        marginBottom: scale(5),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    bottomButtonView:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: scale(28)
    },
    participantsView:{
        width: '90%',
        paddingVertical: scale(8),
    },
    participantsViewTitleText:{
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(32),
        textAlign: 'center',
        marginBottom: scale(10),
        borderBottomWidth: 1,
    },
    participant:{
        flexDirection: 'row',
        gap: scale(8),
        alignItems: 'center',
    },
    participantText:{
        fontFamily: 'Inter',
        fontSize: scale(16),
    },
    adContainer: {
        width: '100%', 
        alignItems: 'center',
        padding: scale(5), 
      },
});

export default UserCompetitionDetailsPage;