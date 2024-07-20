import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState, useCallback } from "react";
import { useIsFocused } from '@react-navigation/native';
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import DisplayAccountDetailsPresenter from '../../presenter/DisplayAccountDetailsPresenter';

const UserAccountDetailsPage = ({ navigation, route }) => {

    const { user } = route.params;
    const userEmail = user.email;

    //check when this screen is focus
    const isFocused = useIsFocused(); // Get the focused state of the screen

    const [userDetails, setuserDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // User Details
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [medical, setMedical] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [goal, setGoal] = useState('');
    const [level, setLevel] = useState('');


    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    const loadAccountDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            await new DisplayAccountDetailsPresenter({ viewAccountDetails: setuserDetails }).viewAccountDetails(userEmail);
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            setModalVisible(true);
            setModalMsg(error.message);
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
            setFullName(userDetails[0].user.fullName);
            setEmail(userDetails[0].user.email);
            setphoneNumber(userDetails[0].user.phoneNumber);
            if (userDetails[0].user.gender == 'm') {
                setGender("Male");
            }
            else {
                setGender("Female")
            }
            setWeight(userDetails[0].user.weight + "kg");
            setHeight(userDetails[0].user.height + "cm");
            setGoal(userDetails[0].user.fitnessGoal);
            setLevel(userDetails[0].user.fitnessLevel);
            if (userDetails[0].user.hasMedical == false) {
                setMedical("No");
            }
            else {
                setMedical("Yes")
            }
            {/* May insert more user details if needed */ }
        }
    }, [userDetails]);

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.headerText}>Account Details</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
            <View style={styles.detailsBox}>
                <Text style={styles.detailsTitle}>Name</Text>
                <Text style={styles.detailsText}>{fullName}</Text>
                <Text style={styles.detailsTitle}>Email</Text>
                <Text style={styles.detailsText}>{email}</Text>
                <Text style={styles.detailsTitle}>Gender</Text>
                <Text style={styles.detailsText}>{gender}</Text>
                <Text style={styles.detailsTitle}>Phone Number</Text>
                <Text style={styles.detailsText}>{phoneNumber}</Text>
                <Text style={styles.detailsTitle}>Weight</Text>
                <Text style={styles.detailsText}>{weight}</Text>
                <Text style={styles.detailsTitle}>Height</Text>
                <Text style={styles.detailsText}>{height}</Text>
                <Text style={styles.detailsTitle}>Fitness Goal</Text>
                <Text style={styles.detailsText}>{goal}</Text>
                <Text style={styles.detailsTitle}>Fitness Level</Text>
                <Text style={styles.detailsText}>{level}</Text>
                <Text style={styles.detailsTitle}>Medical Condition</Text>
                <Text style={styles.detailsText}>{medical}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("UserUpdateAccountDetailsPage", { user, userDetails })}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
        </View>
    )
}
export default UserAccountDetailsPage;

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
        backgroundColor: 'white',
    },
    editButton: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingHorizontal: scale(50),
        paddingVertical: scale(5),
        marginTop: scale(25),

    },
    editText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
})