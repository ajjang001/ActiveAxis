import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';

const UserExerciseSettingsPage = ({ route }) => {

    const { user } = route.params;

    console.log(user);

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Exercise Settings</Text>
            </View>
            <View style={styles.settingsContainer}>
                <Text>Insert all exercise settings here for user to view!</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => console.log("Navigate to Edit Exercise Settings page")}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
        </View>


    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    headerBox: {
        backgroundColor: '#E28413',
        width: '100%',
        height: '8%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(10),
    },
    settingsContainer: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(15),
        marginTop: scale(20),
        borderColor: '#C42847',
        alignItems: 'center',
    },
    editButton: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingHorizontal: scale(50),
        paddingVertical: scale(5),
        marginTop: scale(25),

    },
    editText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
});


export default UserExerciseSettingsPage;