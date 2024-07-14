import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Alert } from 'react-native';
import { scale } from '../../components/scale';
import { ActionDialog, LoadingDialog } from '../../components/Modal';
import { TextInput } from 'react-native-gesture-handler';
import EditUserAccountDetailsPresenter from '../../presenter/EditUserAccountDetailsPresenter';

const EditUserAccountDetailsPage = ({ navigation, route }) => {

    const { user } = route.params;
    const userID = user.id;

    const [newPassword, setnewPassword] = useState('');
    const [confirmnewPassword, setconfirmnewPassword] = useState('');

    // State to control the visibility of the modal
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');


    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // Function to save details
    const onPressSave = async () => {
        changeLoadingVisible(true);
        try {
            console.log(userID);
            //console.log(newPassword);
            //console.log(confirmnewPassword);
            await new EditUserAccountDetailsPresenter().updatePassword(userID, newPassword, confirmnewPassword)
            Alert.alert('Successfully updated password for user!')
            navigation.navigate('UserAccountListPage')
        } catch (error) {
            console.log(error);
            Alert.alert(error.message);
        } finally {
            changeLoadingVisible(false);
        }


    }

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Edit Account Password</Text>
            </View>
            <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Password</Text>
                <TextInput style={styles.detailsText} placeholder='Enter new password' onChangeText={text => setnewPassword(text) } secureTextEntry></TextInput>
                <Text style={styles.detailsTitle}>Confirm New Password</Text>
                <TextInput style={styles.detailsText} placeholder='Confirm new password' onChangeText={text => setconfirmnewPassword(text) } secureTextEntry></TextInput>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={() => changeModalVisible(true, 'Do you want to save changes?')}>
                <Text style={styles.saveButtonText}>SAVE</Text>
            </TouchableOpacity>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <ActionDialog
                    message={modalMsg}
                    changeModalVisible={changeModalVisible}
                    action={onPressSave}
                />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
        </View>
    )
}
export default EditUserAccountDetailsPage;

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
        marginVertical: scale(40),

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
    saveButton: {
        backgroundColor: '#000022',
        padding: scale(10),
        borderRadius: 10,
        alignItems: 'center',
        width: '85%',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
})