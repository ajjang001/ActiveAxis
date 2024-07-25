import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';

const UserCompetitionPage = ({ navigation, route }) => {

    const { user } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Competitions</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate("UserCreateCompetitionPage", { user })
                }>
                    <Text style={styles.buttonText}>Create Competitions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate("UserCompetitionHistoryPage", { user })
                }>
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.competitionContainer}>
                <Text>Insert Competitions here!</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: scale(70),
    },
    headerContainer: {
        width: '90%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(10),
    },
    buttonContainer: {
        width: '90%',
        flexDirection: 'row',
    },
    button: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingVertical: scale(5),
        marginTop: scale(10),
        flex: 1,
        marginHorizontal: scale(8),

    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
    competitionContainer: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(15),
        marginTop: scale(20),
        borderColor: '#C42847',
        alignItems: 'center',
    },
});


export default UserCompetitionPage;