import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';

const UserCoachPage = ({ route }) => {

    const { user } = route.params;

    console.log(user);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Coach</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() =>
                    //navigation.navigate("UserUpdateAccountDetailsPage", { user, userDetails })
                    console.log("Navigate to Coach History Page")
                }>
                    <Text style={styles.buttonText}>Coach History</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.coachContainer}>
                <Text>Insert Coaches here!</Text>
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
        width: '30%',
        alignSelf: 'flex-end',
        marginRight: scale(20),
    },
    button: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingVertical: scale(5),
        marginTop: scale(10),
        marginHorizontal: scale(10),

    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
    coachContainer: {
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


export default UserCoachPage;