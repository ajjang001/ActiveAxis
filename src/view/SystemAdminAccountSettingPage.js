import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Modal, Alert } from 'react-native';
import { scale } from '../components/scale';
import { LoadingDialog } from '../components/Modal';
import { TextInput } from 'react-native-gesture-handler';
import UpdateAccountDetailsPresenter from '../presenter/UpdateAccountDetailsPresenter';

const SystemAdminAccountSettingPage = ({ navigation, route }) => {

    const { admin } = route.params;

    const email = admin.email;
    // State to control the visibility of the modal
    const [isLoading, setIsLoading] = useState(false);

    // Function to change the visibility of the modal
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // Function to update the account details
    const updateAccount = async (email) => {
        try {
            changeLoadingVisible(true);
            console.log({ email })
            await new UpdateAccountDetailsPresenter().updateAccount(email);
            Alert.alert("Kindly check your email to reset your password!");
            navigation.navigate('SystemAdminHomePage', {admin})
        } catch (e) {
            Alert.alert(e.message);
        } finally {
            changeLoadingVisible(false);
        }
    };


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
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <TouchableOpacity style={styles.resetButton} onPress={() => updateAccount(email)}>
                <Text style={styles.resetText}>Click here to reset password!</Text>
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
    resetButton: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingHorizontal: scale(50),
        paddingVertical: scale(10),
        marginTop: 20,

    },
    resetText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
})