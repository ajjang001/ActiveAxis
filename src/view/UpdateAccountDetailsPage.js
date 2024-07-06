import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { scale } from '../components/scale';
import { ActionDialog, LoadingDialog } from '../components/Modal';
import { TextInput } from 'react-native-gesture-handler';

const UpdateAccountDetailsPage = ({ navigation, route }) => {

    const {admin} = route.params;

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

        } catch (error) {
            console.log(error);
        } finally {
            changeLoadingVisible(false);
        }


    }

    return (
        <View style={styles.container}>
            <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Name</Text>
                <TextInput style={styles.detailsText}>{admin.username}</TextInput>
                <Text style={styles.detailsTitle}>Email</Text>
                <TextInput style={styles.detailsText}>{admin.email}</TextInput>
                <Text style={styles.detailsTitle}>Password</Text>
                <TextInput style={styles.detailsText} placeholder='Enter new password'></TextInput>
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
export default UpdateAccountDetailsPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C42847',
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(20),
        borderWidth: 2,
        borderRadius: scale(36),

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
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '85%',
        justifyContent: 'center',
        marginTop: 30,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
})