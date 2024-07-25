import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';

const UserCompetitionHistoryPage = ({ route }) => {

    const { user } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>History</Text>
            </View>
        </View>


    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    headerBox: {
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
});


export default UserCompetitionHistoryPage;