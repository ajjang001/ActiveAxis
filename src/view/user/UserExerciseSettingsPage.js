import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { scale } from '../../components/scale';
import { useIsFocused } from '@react-navigation/native';
import { LoadingDialog, MessageDialog } from "../../components/Modal";

import ExerciseSettingCard from '../../components/ExerciseSettingCard';
import DisplayExerciseSettingsPresenter from '../../presenter/DisplayExerciseSettingsPresenter';

const UserExerciseSettingsPage = ({ navigation, route }) => {

    const { user, userType } = route.params;
    const userEmail = user.email;

    //check when this screen is focus
    const isFocused = useIsFocused(); // Get the focused state of the screen

    const [userDetails, setuserDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // User Details
    const [restInterval, setrestInterval] = useState('');
    const [stepTarget, setstepTarget] = useState('');
    const [calorieTarget, setcalorieTarget] = useState('');

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    const view = {
        displayAccountDetails: (accountDetails) => {
            setuserDetails(accountDetails);
        },
    };

    const loadAccountDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const presenter = new DisplayExerciseSettingsPresenter(view);
            await presenter.viewAccountDetails(userEmail, userType);
        } catch (error) {
            setIsLoading(false);
            setModalVisible(true);
            setModalMsg(error.message);
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    //refresh when redirected
    useEffect(() => {
        if (isFocused) {
            loadAccountDetails();
        }
    }, [isFocused, loadAccountDetails]);

    useEffect(() => {
        loadAccountDetails();
    }, []);

    useEffect(() => {
        // Ensure user is populated before logging or using it
        if (userDetails.length > 0) {
            setrestInterval(userDetails[0].user.restInterval);
            setstepTarget(userDetails[0].user.stepTarget);
            setcalorieTarget(userDetails[0].user.calorieTarget);
        }
    }, [userDetails]);

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Exercise Settings</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <View style={styles.settingsContainer}>
                <ExerciseSettingCard title="Exercise Rest Interval" value={restInterval} unit="seconds" />
                <ExerciseSettingCard title="Daily Steps Target" value={stepTarget} unit="steps" />
                <ExerciseSettingCard title="Daily Calorie Burn Target" value={calorieTarget} unit="kcal" />
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('UserUpdateExerciseSettingsPage', { user, userDetails })}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
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
        marginTop: scale(40),
        width: '85%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(36),
        borderColor: '#C42847',
        alignItems: 'center'
    },
    editButton: {
        width: '50%',
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingHorizontal: scale(50),
        paddingVertical: scale(10),
        marginTop: scale(35),
        borderRadius: scale(8),
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