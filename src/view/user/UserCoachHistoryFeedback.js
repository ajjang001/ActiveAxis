import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';

const UserCoachHistoryFeedback = ({ route }) => {

    const { user, coachDetails } = route.params;

    console.log(coachDetails);

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Coach Feedback</Text>
            </View>
        </View>


    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
    },
    headerBox: {
        width: '90%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(10),
    },
});


export default UserCoachHistoryFeedback;