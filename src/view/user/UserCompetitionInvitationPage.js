import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';

import InviteFriendToCompetitionPresenter from '../../presenter/InviteFriendToCompetitionPresenter';

const UserCompetitionInvitationPage = ({navigation, route})=>{

    const {user} = route.params;

    const [competitionList, setCompetitionList] = useState([]);
    console.log(competitionList);

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

    const loadInvitations = async () => {
        try{
            changeLoadingVisible(true);
            await new InviteFriendToCompetitionPresenter({updateCompetitionList: setCompetitionList}).getMyPendingInvites(user.accountID);

        }catch(error){
            changeModalVisible(true, error.message);
        }finally{
            changeLoadingVisible(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadInvitations();
        }, [])
    );

    return(
        <View style={styles.container}>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
            </Modal>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Invitation</Text>
            </View>

            <ScrollView contentContainerStyle={styles.competitionContainer}>
                {
                    competitionList.length <= 0 ?
                    <Text style = {styles.noCompetitionText}>No competition invites</Text>
                    :
                    <>
                        {
                            competitionList.map((competition, index) => {
                                return(
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
                                        </View>
                                    </View>      
                                );
                            })
                        }
                    </>
                }
            </ScrollView>   


        </View>
    );

}

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
        fontFamily: 'League-Spartan-SemiBold',
        textAlign: 'center',
        marginVertical: scale(10),
    },
    competitionContainer: {
        width: '95%',
        marginTop: scale(8),
    },
    noCompetitionText:{
        fontSize: scale(16),
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
        marginVertical: scale(10),
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


});

export default UserCompetitionInvitationPage;