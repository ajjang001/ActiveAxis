import { View, Text, StyleSheet, Modal } from "react-native"
import { scale } from "../../components/scale";
import React, { useEffect, useState } from "react";
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import ViewCoacheePresenter from '../../presenter/ViewCoacheePresenter';

const ViewCoacheeDetails = ({ route }) => {

    const { user } = route.params;
    const userEmail = user.user.email;

    const [coachee, setCoachee] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // Coachee Details
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    {/* May insert more Coachee details if needed */}

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    const loadCoacheeDetails = async () => {
        try {
            setIsLoading(true);
            await new ViewCoacheePresenter({ loadCoacheeDetails: setCoachee }).viewCoacheeDetails(userEmail);
                setTimeout(() => {
                    setIsLoading(false);
                }, 1500);
        } catch (error) {
            setModalVisible(true);
            setModalMsg(error.message);
        }
    };

    useEffect(() => {
        loadCoacheeDetails();
    }, []);

    useEffect(() => {
        // Ensure coachee is populated before logging or using it
        if (coachee.length > 0) {
            setFullName(coachee[0].user.fullName);
            setEmail(coachee[0].user.email);
            setphoneNumber(coachee[0].user.phoneNumber);
            {/* May insert more Coachee details if needed */}
            //console.log({ coachee });
        }
    }, [coachee]);

    return (
        <View style={styles.container}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}>Coachee Name Details</Text>
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
                <Text style={styles.detailsTitle}>Phone Number</Text>
                <Text style={styles.detailsText}>{phoneNumber}</Text>
                {/* May insert more Coachee details if needed */}
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C42847',
        alignItems: 'center',
    },
    headerBox: {
        backgroundColor: '#D9D9D9',
        width: '90%',
        marginVertical: scale(20),
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
        paddingVertical: scale(30),
        borderWidth: 2,
        borderRadius: scale(36),
        marginTop: scale(35),
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
});

export default ViewCoacheeDetails;