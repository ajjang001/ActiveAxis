import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { LoadingDialog, ActionDialog, MessageDialog } from "../../components/Modal";
import { scale } from '../../components/scale';
import EditUserAccountDetailsPresenter from '../../presenter/EditUserAccountDetailsPresenter';

const SystemAdminUpdatePasswordPage = ({ navigation, route }) => {

    const { admin } = route.params;
    const userID = admin.id;

    const [newPassword, setnewPassword] = useState('');
    const [confirmnewPassword, setconfirmnewPassword] = useState('');

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

    // Process Update Password
    const processUpdate = async () => {
        changeLoadingVisible(true);
        try {
            console.log(userID);
            await new EditUserAccountDetailsPresenter().updatePassword(userID, newPassword, confirmnewPassword)
            Alert.alert('Successfully updated password for user!')
            navigation.navigate('SystemAdminAccountSettingPage', { admin })
        } catch (e) {
            console.log(e);
            changeModal1Visible(true, e.message);
        } finally {
            changeLoadingVisible(false);
        }
    };
    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Update Account Password</Text>
            </View>
            <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>New Password</Text>
                <TextInput
                    style={styles.input}
                    value={newPassword}
                    placeholder='Enter new password'
                    onChangeText={setnewPassword}
                    secureTextEntry
                />
                <Text style={styles.detailsTitle}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    value={confirmnewPassword}
                    placeholder='Confirm new password'
                    onChangeText={setconfirmnewPassword}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity style={styles.updateButton} onPress={() => changeModalVisible(true, 'Do you want to save changes?')}>
                <Text style={styles.updateText}>Update</Text>
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
        backgroundColor: '#C42847',
    },
    headerBox: {
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
        marginTop: scale(40),
    },
    detailsTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        marginVertical: scale(2),
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: scale(15),
        borderRadius: scale(8),
        paddingVertical: scale(10),
        marginBottom: scale(10),
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: scale(18),
        fontFamily: 'Inter',
    },
    updateButton: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingHorizontal: scale(100),
        paddingVertical: scale(10),
        marginTop: scale(25),
    },
    updateText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
});


export default SystemAdminUpdatePasswordPage;