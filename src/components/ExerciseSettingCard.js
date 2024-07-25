import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from './scale';

const ExerciseSettingCard = ({ title, value, unit }) => {
    return (
        <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardValue}>
                {value} {unit}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    detailCard: {
        width: '90%',
        margin: scale(15),
        padding: scale(30),
        borderRadius: scale(8),
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: scale(8),
        elevation: scale(4),
        alignItems: 'center',
    },
    cardTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(20),
        marginBottom: scale(20),
        textAlign: 'center',
    },
    cardValue: {
        fontSize: scale(18),
        fontFamily: 'Inter',
        color: '#333',
        textAlign: 'center',
        borderWidth: 1, 
        borderColor: '#E28413',
        borderRadius: scale(8),
        paddingHorizontal: scale(20),
        paddingVertical: scale(10),
    },
});

export default ExerciseSettingCard;