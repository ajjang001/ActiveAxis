import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { scale } from '../../components/scale';

const UserCoachHistoryDetails = ({ route }) => {

    const { user, coachDetails } = route.params;

    console.log(coachDetails);

    const formattedPrice = coachDetails.coachPrice.toFixed(2);

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Coach Details</Text>
            </View>
            <View style={styles.detailsBox}>
                {coachDetails.coachPicture !== '' ? (
                    <View style={styles.pictureContainer}>
                        <Image source={{ uri: coachDetails.coachPicture }} resizeMode='stretch' style={styles.coachImage} />
                    </View>
                ) : (
                    <ActivityIndicator style={styles.pictureContainer} size="large" />
                )}
                <Text style={styles.detailsTitle}>Name</Text>
                <Text style={styles.detailsText}>{coachDetails.coachFullName}</Text>
                <Text style={styles.detailsTitle}>Email</Text>
                <Text style={styles.detailsText}>{coachDetails.coachEmail}</Text>
                <Text style={styles.detailsTitle}>Phone Number</Text>
                <Text style={styles.detailsText}>{coachDetails.coachPhone}</Text>
                <Text style={styles.detailsTitle}>Coach Rate (Monthly)</Text>
                <Text style={styles.detailsText}>${formattedPrice}</Text>
            </View>
        </View>


    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#C42847',
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
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(36),
        alignSelf: 'center',
        marginBottom: scale(30),
    },
    detailsTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
    },
    detailsText: {
        fontFamily: 'Inter',
        fontSize: scale(16),
        marginBottom: scale(5),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        backgroundColor: 'white',
    },
    pictureContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    coachImage: {
        width: scale(120),
        height: scale(120),
        backgroundColor: 'white',
        borderRadius: scale(75)
    },
});


export default UserCoachHistoryDetails;