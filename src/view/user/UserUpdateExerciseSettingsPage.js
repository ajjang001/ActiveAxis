import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { LoadingDialog, ActionDialog, MessageDialog } from "../../components/Modal";
import { scale } from '../../components/scale';

const UserUpdateExerciseSettingsPage = ({ navigation, route }) => {

    const { user, userDetails } = route.params;

    // User Details
    const [email] = useState(userDetails[0].user.email)
    const [restInterval, setrestInterval] = useState(String(userDetails[0].user.restInterval));
    const [stepTarget, setstepTarget] = useState(String(userDetails[0].user.stepTarget));
    const [calorieTarget, setcalorieTarget] = useState(String(userDetails[0].user.calorieTarget));

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeModal1Visible = (b, m) => {
        setModalMsg(m);
        setModal1Visible(b);
    }


    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // Process Update Exercise Settings
    const processUpdate = async () => {
        changeLoadingVisible(true);
        try {
            //await new UpdateAccountDetailsPresenter().updateAccountDetails(email, gender, phoneNumber1, weight, height, fitnessGoal, fitnessLevel, hasMedical);
            navigation.navigate('UserExerciseSettingsPage', { user })
            Alert.alert('Successfully updated exercise settings!')
        } catch (e) {
            changeModal1Visible(true, e.message);
            //Alert.alert(e.message);
        } finally {
            changeLoadingVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Update Exercise Settings</Text>
            </View>
            <View style={styles.settingsContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputText}>Rest Interval (seconds)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={restInterval}
                        onChangeText={setrestInterval}
                    />
                    <Text style={styles.inputText}>Daily Step Target</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={stepTarget}
                        onChangeText={setstepTarget}
                    />
                    <Text style={styles.inputText}>Daily Calorie Burn Target (calories)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={calorieTarget}
                        onChangeText={setcalorieTarget}
                    />
                </View>
            </View>
            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => changeModalVisible(true, 'Do you want to save changes?')}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <ActionDialog
                    message={modalMsg}
                    changeModalVisible={changeModalVisible}
                    action={processUpdate}
                />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modal1Visible} nRequestClose={() => changeModal1Visible(false)}>
                <MessageDialog
                    message={modalMsg}
                    changeModalVisible={changeModal1Visible}
                />
            </Modal>
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
        marginTop: scale(40),
        width: '85%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(36),
        borderColor: '#C42847',
        alignItems: 'center'
    },
    inputContainer: {
        width: '100%',
        marginTop: scale(10),
        marginBottom: scale(20),
    },
    inputText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(20),
        marginVertical: scale(10),
        textAlign: 'center'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: scale(15),
        marginHorizontal: scale(20),
        borderRadius: scale(8),
        paddingVertical: scale(10),
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: scale(18),
        fontFamily: 'Inter',
        textAlign: 'center'
    },
    saveButton: {
        width: '50%',
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingHorizontal: scale(50),
        paddingVertical: scale(10),
        marginTop: scale(35),
        borderRadius: scale(8),
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
});


export default UserUpdateExerciseSettingsPage;