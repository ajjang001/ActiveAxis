import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';
import { useFocusEffect } from '@react-navigation/native';

import DisplayCompetitionsPresenter from '../../presenter/DisplayCompetitionsPresenter';

const UserCompetitionPage = ({ navigation, route }) => {

    const { user } = route.params;

    const [myCompetitions, setMyCompetitions] = useState([]);
    const [participatedCompetitions, setParticipatedCompetitions] = useState([]);

    // Date formatter
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });
    };

    const loadCompetitions = async () => {
        try{
            // setMyCompetitions([]);
            // setParticipatedCompetitions([]);
            // await new DisplayCompetitionsPresenter({updateMyCompetitions: setMyCompetitions, updateParticipatedCompetitions: setParticipatedCompetitions}).loadCompetitions(user.accountID);
        }catch(error){
            console.log(error);
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
                                        <Text style = {styles.competitionDateTitle}>Type: </Text>
                                        <Text>{competition.competitionType}</Text>
                                        <Text>Start Date:</Text>
                                        <Text>{formatDate(competition.startDate)}</Text>
                                        
                                        <Text>End Date: </Text>
                                        <Text>{formatDate(competition.endDate)}</Text>


                                    </View>
                                    <View>
                                        
                                    </View>
                                </View>
                                <View style = {styles.progressView}>
                                    <Text>{competition.competitionName}</Text>
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
        backgroundColor:'#D9D9D9',
        marginBottom: scale(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressView:{
        backgroundColor: 'white',
        height: scale(20),
        width: '45%',

    },
    competitionDetailsView:{
        width: '55%',
        padding: scale(8),
        margin: scale(8),
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
    },
    competitionDateTitle:{
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(14),
    }
});


export default UserCompetitionPage;