import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LoadingDialog, ActionDialog } from "../../components/Modal";
import { scale } from '../../components/scale';

const UserCreateCompetitionPage = ({ navigation, route }) => {

    const { user } = route.params;

    // Competition Details
    const [competitionName, setcompetitionName] = useState('');
    const [competitionType, setcompetitionType] = useState('');
    const [startDate, setstartDate] = useState('');
    const [endDate, setendDate] = useState('');
    const [competitionDetails, setcompetitionDetails] = useState('');

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
    // Process Create Competition
    const processCreate = async () => {
        changeLoadingVisible(true);
        try {
            //insert function here!
            console.log("Create Competition")
            navigation.navigate('UserCompetitionPage', { user })
        } catch (e) {
            console.log(e.message)
        } finally {
            changeLoadingVisible(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.headerBox}>
                    <Text style={styles.headerText}>Create Competition</Text>
                </View>
                <View style={styles.detailsBox}>
                    <TouchableOpacity style={styles.inviteButton} onPress={() => console.log("Invite Friends")}>
                        <Text style={styles.inviteText}>Invite Friends</Text>
                    </TouchableOpacity>
                    <Text style={styles.detailsTitle}>Competition Name</Text>
                    <TextInput
                        style={styles.input}
                        value={competitionName}
                        placeholder='Enter competition name'
                        onChangeText={setcompetitionName}
                    />
                    <Text style={styles.detailsTitle}>Type</Text>
                    <TextInput
                        style={styles.input}
                        value={competitionType}
                        placeholder='Enter competition type'
                        onChangeText={setcompetitionType}
                    />
                    <Text style={styles.detailsTitle}>Start Date</Text>
                    <TextInput
                        style={styles.input}
                        value={startDate}
                        placeholder='Enter start date'
                        onChangeText={setstartDate}
                    />
                    <Text style={styles.detailsTitle}>End Date</Text>
                    <TextInput
                        style={styles.input}
                        value={endDate}
                        placeholder='Enter end date'
                        onChangeText={setendDate}
                    />
                    <Text style={styles.detailsTitle}>Details</Text>
                    <TextInput
                        style={styles.competitionDetailsInput}
                        value={competitionDetails}
                        onChangeText={setcompetitionDetails}
                        multiline={true}
                        numberOfLines={7}
                        maxLength={200}
                        placeholder="Enter your competition details here..."
                        textAlignVertical="top"
                    />
                    <TouchableOpacity style={styles.createButton} onPress={() => changeModalVisible(true, 'Do you want to save changes?')}>
                        <Text style={styles.createText}>CREATE</Text>
                    </TouchableOpacity>
                </View>
                <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                    <ActionDialog
                        message={modalMsg}
                        changeModalVisible={changeModalVisible}
                        action={processCreate}
                    />
                </Modal>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
            </View>
        </TouchableWithoutFeedback>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
    },
    headerBox: {
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
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(15),
        borderWidth: 2,
        borderRadius: scale(36),
        marginTop: scale(10),
        borderColor: '#C42847',
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
    competitionDetailsInput: {
        backgroundColor: 'white',
        paddingHorizontal: scale(15),
        borderRadius: scale(8),
        paddingVertical: scale(15),
        marginBottom: scale(10),
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: scale(18),
        fontFamily: 'Inter',
    },
    createButton: {
        borderWidth: 1,
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#C42847',
        paddingHorizontal: scale(50),
        paddingVertical: scale(5),
        marginTop: scale(15),
        marginBottom: scale(15)
    },
    createText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
    inviteButton: {
        width: '35%',
        backgroundColor: '#E28413',
        paddingVertical: scale(5),
        alignSelf: 'flex-end',
        marginBottom: scale(10),
        marginRight: scale(2),
        borderRadius: scale(8)
    },
    inviteText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
});


export default UserCreateCompetitionPage;