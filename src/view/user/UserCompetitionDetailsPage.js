import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

const UserCompetitionDetailsPage = ({ navigation, route }) => {
    const { user, competition } = route.params;

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

    return(
        <ScrollView >
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            <View style = {styles.container}>
                <View style={styles.detailsBox}>
                    {
                        (user.accountID === competition.host_userID) && (competition.startDate.toDate() > new Date())
                        ? <View style = {styles.topButtonView}>
                            <TouchableOpacity style={styles.topButton}>
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

                    <View style ={styles.bottomButtonView}>
                        <TouchableOpacity style = {styles.topButton} onPress={() => console.log('LeaderboardPage')}>
                            <Text style = {styles.topButtonText}>Leaderboard</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
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
    }
});

export default UserCompetitionDetailsPage;