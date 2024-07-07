import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { scale } from '../components/scale';



const SystemAdminAccountSettingPage = ({ navigation, route }) => {

    const {admin} = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Account Settings</Text>
            </View>
            <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Name</Text>
                <Text style={styles.detailsText}>{admin.username}</Text>
                <Text style={styles.detailsTitle}>Email</Text>
                <Text style={styles.detailsText}>{admin.email}</Text>
                <Text style={styles.detailsTitle}>Password</Text>
                <Text style={styles.detailsText}>*********</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('UpdateAccountDetailsPage', {admin})}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
        </View>
    )
}
export default SystemAdminAccountSettingPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C42847',
        alignItems: 'center',
    },
    headerView: {
        backgroundColor: '#E28413',
        width: '100%',
        height: '10%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(20),
    },
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(20),
        borderWidth: 2,
        borderRadius: scale(36),
        marginTop: 35,
    },
    detailsTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
    },
    detailsText: {
        fontFamily: 'Inter',
        fontSize: scale(16),
        marginBottom: scale(15),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        backgroundColor: 'white',
    },
    editButton: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingHorizontal: scale(50),
        marginTop: 20,

    },
    editText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
})