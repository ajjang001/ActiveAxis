import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';

const UserAchievementPage = ({ navigation, route }) => {

    const { user } = route.params;

    console.log(user);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Achievements</Text>
            </View>
            <View style={styles.achievementContainer}>
                <Text>Insert Achievements here!</Text>
            </View>
        </View>


    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    achievementContainer: {
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


export default UserAchievementPage;