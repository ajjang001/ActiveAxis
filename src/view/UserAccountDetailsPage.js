import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import { scale } from '../components/scale';
import { ActionDialog, LoadingDialog, MessageDialog } from '../components/Modal';


const UserAccountDetailsPage = ({ navigation , route }) => {
    const { user } = route.params;

    //  State to store information
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [dob, setDob] = useState(null);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // convert firebase timestamp to date
    const convertToDate = (firebaseTimestamp) => {
        const date = firebaseTimestamp.toDate();
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setLoading(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // load feedbacks and dob
    useEffect(() => {
        setDob(convertToDate(user.user.dob));
    }, []);



    return (
        <View style={styles.container}>
            <Modal transparent={true} animationType='fade' visible={loading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>

            <ScrollView contentContainerStyle={styles.contentContainer}>

                <View style={styles.detailsBox}>
                    <View style={styles.pictureContainer}>
                        <Image source={{ uri: user.user.profilePicture }} resizeMode='stretch' style={styles.userImage} />
                    </View>

                    <Text style={styles.detailsTitle}>Name</Text>
                    <Text style={styles.detailsText}>{user.user.fullName}</Text>
                    <Text style={styles.detailsTitle}>Username</Text>
                    <Text style={styles.detailsText}>{user.user.username}</Text>
                    <Text style={styles.detailsTitle}>Email</Text>
                    <Text style={styles.detailsText}>{user.user.email}</Text>
                    <Text style={styles.detailsTitle}>Phone Number</Text>
                    <Text style={styles.detailsText}>{user.user.phoneNumber}</Text>
                    <Text style={styles.detailsTitle}>Gender</Text>
                    <Text style={styles.detailsText}>{user.user.gender === 'm' ? "Male" : "Female"}</Text>
                    <Text style={styles.detailsTitle}>Date of Birth</Text>
                    <Text style={styles.detailsText}>{dob}</Text>

                </View>

                <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditUserAccountDetailsPage', {user})}>
                    <Text style={styles.editButtonText}>Edit Account</Text>
                </TouchableOpacity>
            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C42847',
        width: '100%',
        height: '100%',

    },
    contentContainer: {
        display: 'flex',
        alignItems: 'center',


    },
    userImage: {
        width: scale(125),
        height: scale(125),
        marginHorizontal: scale(25),
        backgroundColor: 'white',
        borderRadius: scale(75),
    },
    deleteButton: {
        borderWidth: 1,
        backgroundColor: '#E28413',
        paddingHorizontal: scale(50),

    },
    deleteText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Inter',
        fontWeight: 'bold',
        fontSize: scale(16)
    },
    detailsBox: {
        width: '90%',
        backgroundColor: '#E6E6E6',
        padding: scale(20),
        borderWidth: 2,
        borderRadius: scale(36),
        marginTop: scale(25),

    },
    pictureContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
    editButton: {
        backgroundColor: '#000022',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '85%',
        justifyContent: 'center',
        marginTop: 30,
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default UserAccountDetailsPage;