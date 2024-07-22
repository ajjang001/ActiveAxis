import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from "react-native"
import { scale } from "../../components/scale";
import React, { useState } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import { LoadingDialog, ActionDialog, MessageDialog } from "../../components/Modal";
import UpdateAccountDetailsPresenter from '../../presenter/UpdateAccountDetailsPresenter';

const UserUpdateAccountDetailsPage = ({ navigation, route }) => {

    const genderData = [
        { label: 'Male', value: 'm' },
        { label: 'Female', value: 'f' },
    ];
    const goalsData = [
        { label: 'Goal 1', value: 'Goal 1' },
        { label: 'Goal 2', value: 'Goal 2' },
        { label: 'Goal 3', value: 'Goal 3' },
    ];
    const levelData = [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
    ];
    const medicalData = [
        { label: "Yes", value: true },
        { label: "No", value: false },
    ];

    const { user, userDetails } = route.params;

    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // To use to update User Details
    const [email] = useState(userDetails[0].user.email)
    const [phoneNumber, setphoneNumber] = useState(userDetails[0].user.phoneNumber.substring(3));
    const [gender, setGender] = useState(userDetails[0].user.gender);
    const [weight, setWeight] = useState(String(userDetails[0].user.weight));
    const [height, setHeight] = useState(String(userDetails[0].user.height));
    const [fitnessGoal, setGoal] = useState(userDetails[0].user.fitnessGoal);
    const [fitnessLevel, setLevel] = useState(userDetails[0].user.fitnessLevel);

    const [hasMedical, setMedical] = useState(userDetails[0].user.hasMedical);

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

    // Process Update Account Details
    const processUpdate = async () => {
        changeLoadingVisible(true);
        try {
            // include back +65
            phoneNumber1 = "+65" + phoneNumber;
            await new UpdateAccountDetailsPresenter().updateAccountDetails(email, gender, phoneNumber1, weight, height, fitnessGoal, fitnessLevel, hasMedical);
            navigation.navigate('UserAccountDetailsPage1', { user })
            Alert.alert('Successfully updated account information for user!')
        } catch (e) {
            changeModal1Visible(true, e.message);
            //Alert.alert(e.message);
        } finally {
            changeLoadingVisible(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Edit Account Details</Text>
            </View>
            <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Name</Text>
                <Text style={styles.detailsText}>{userDetails[0].user.fullName}</Text>
                <Text style={styles.detailsTitle}>Email</Text>
                <Text style={styles.detailsText}>{email}</Text>
                <Text style={styles.detailsTitle}>Gender</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={genderData}
                    labelField="label"
                    valueField="value"
                    value={gender}
                    onChange={item => {
                        setGender(item.value);
                    }}
                />
                <Text style={styles.detailsTitle}>Phone Number</Text>
                <View style={styles.phoneContainer}>
                    <Text style={styles.countryCode}>+65</Text>
                    <TextInput
                        style={styles.phoneinput}
                        keyboardType="phone-pad"
                        maxLength={8}
                        returnKeyType='done'
                        value={phoneNumber}
                        onChangeText={text => setphoneNumber(text)}
                    />
                </View>
                <Text style={styles.detailsTitle}>Weight (KG)</Text>
                <TextInput
                    style={styles.input}
                    value={weight}
                    maxLength={3}
                    keyboardType="phone-pad"
                    returnKeyType='done'
                    onChangeText={text => setWeight(text)}
                />
                <Text style={styles.detailsTitle}>Height (CM)</Text>
                <TextInput
                    value={height}
                    onChangeText={text => setHeight(text)}
                    style={styles.input}
                    maxLength={3}
                    keyboardType="phone-pad"
                    returnKeyType='done'
                />
                <Text style={styles.detailsTitle}>Fitness Goal</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={goalsData}
                    labelField="label"
                    valueField="value"
                    value={fitnessGoal}
                    onChange={item => {
                        setGoal(item.value);
                    }}
                />
                <Text style={styles.detailsTitle}>Fitness Level</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={levelData}
                    labelField="label"
                    valueField="value"
                    value={fitnessLevel}
                    onChange={item => {
                        setLevel(item.value);
                    }}
                />
                <Text style={styles.detailsTitle}>Medical Condition</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={medicalData}
                    labelField="label"
                    valueField="value"
                    value={hasMedical}
                    onChange={item => {
                        setMedical(item.value);
                    }}
                />
            </View>
            <TouchableOpacity style={styles.saveButton}
                onPress={() => changeModalVisible(true, 'Do you want to save changes?')}>
                <Text style={styles.saveText}>Save</Text>
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
    )
}
export default UserUpdateAccountDetailsPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    headerView: {
        backgroundColor: '#E28413',
        width: '100%',
        height: '8%',
    },
    headerText: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: scale(15),
    },
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(36),
        marginTop: scale(20),
        borderColor: '#C42847',
    },
    detailsTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        marginVertical: scale(2),
    },
    detailsText: {
        fontFamily: 'Inter',
        fontSize: scale(16),
        marginBottom: scale(5),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        backgroundColor: '#F5F5F5', // Light gray background to indicate it's not editable
        color: '#999999', // Muted text color
    },
    saveButton: {
        backgroundColor: '#000022',
        width: '80%',
        padding: scale(10),
        marginTop: scale(20),
        borderRadius: scale(10),
        alignItems: 'center',
    },
    saveText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
    dropdown: {
        backgroundColor: 'white',
        borderBottomColor: 'gray',
        paddingHorizontal: scale(15),
        paddingVertical: scale(2),
        borderRadius: scale(8),
    },
    phoneinput: {
        backgroundColor: 'white',
        paddingHorizontal: scale(15),
        borderRadius: scale(8),
        flex: 1,
    },
    phoneContainer: {
        flexDirection: 'row',
    },
    countryCode: {
        fontFamily: 'Inter',
        fontSize: scale(16),
        paddingHorizontal: scale(15),
        paddingVertical: scale(10),
        borderRadius: scale(8),
        marginRight: scale(5),
        backgroundColor: '#F5F5F5', // Light gray background to indicate it's not editable
        color: '#999999', // Muted text color
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: scale(15),
        borderRadius: scale(8),
        paddingVertical: scale(8),
    },
})