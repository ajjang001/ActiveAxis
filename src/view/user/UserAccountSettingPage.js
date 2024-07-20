import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import { scale } from '../../components/scale';
import LogoutPresenter from '../../presenter/LogoutPresenter';
import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebaseConfig';

const UserAccountSettingPage = ({ navigation, route }) => {

    const [user, setUser] = useState(route.params.user !== undefined ? route.params.user : null);

    const [imageURL, setImageURL] = useState('');

    // get image url
    useEffect(() => {
        const getImageURL = async (c) => {
            const storageRef = ref(storage, c.profilePicture);
            const url = await getDownloadURL(storageRef);
            setImageURL(url);
        };
        getImageURL(user);
    }, []);

    // State to control the visibility of the modal
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change popup/modal visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeConfirmVisible = (b, m) => {
        setConfirmMessage(m);
        setConfirmationVisible(b);
    }

    // Function to log out the user
    const onPressLogout = async () => {
        changeLoadingVisible(true);
        try {
            await new LogoutPresenter({ getAccount: user, setAccount: setUser }).logoutAccount();
            navigation.dispatch(
                StackActions.replace('LoginPage', null, { ...TransitionPresets.SlideFromRightIOS })
            );

        } catch (error) {
            changeModalVisible(true, error.message);
        } finally {
            changeLoadingVisible(false);
        }
    }

    // Reset the state when the component gains focus
    useFocusEffect(
        useCallback(() => {
            // Reset state when the component gains focus
            return () => {
                setUser(route.params.user !== undefined ? route.params.user : null);
                setModalVisible(false);
            };
        }, [route.params.user])
    );

    // Options for the user
    const options = [
        { label: 'Remove Advertisements', onPress: () => console.log("Remove Advertisements") },
        { label: 'Account Details', onPress: () => navigation.navigate("UserAccountDetailsPage1", {user}) },
        { label: 'Friends', onPress: () => console.log("Friends") },
        { label: 'App Feedbacks', onPress: () => console.log("App Feedbacks") },
        { label: 'Achievements', onPress: () => console.log("Achievements") },
        { label: 'Connect Smart Wearables', onPress: () => console.log("Connect Smart Wearables") },
        { label: 'Delete Account', onPress: () => console.log("Delete Account") },
        { label: 'Log Out', onPress: () => changeConfirmVisible(true, 'Are you sure you want to log out?') }
    ];

    return (
        <ScrollView style={styles.container}>
            {user && (
                <View style={styles.profileContainer}>
                    <View style={styles.imageContainer}>
                        {imageURL !== '' ? (
                            <Image source={{ uri: imageURL }} style={styles.profileImage} />
                        ) : (
                            <LoadingDialog />
                        )}
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.topText}>{user.fullName}</Text>
                        <Text style={styles.topText}>{user.email}</Text>
                        <Text style={styles.topText}>{user.phoneNumber}</Text>
                    </View>
                </View>
            )}

            {
                options.map((option, index) => (
                    <TouchableOpacity key={index} style={styles.optionButton} activeOpacity={0.8} onPress={option.onPress}>
                        <Text style={styles.buttonText}>{option.label}</Text>
                    </TouchableOpacity>
                ))

            }

            <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={() => changeConfirmVisible(false)}>
                <ActionDialog
                    message={confirmMessage}
                    changeModalVisible={changeConfirmVisible}
                    action={onPressLogout}
                />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C42847',
    },
    profileContainer: {
        padding: scale(20),
        marginTop: scale(35),
        flexDirection: 'row',
    }
    ,
    topText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: scale(16),
        color: 'white',
        paddingVertical: scale(5),
    },
    optionButton: {
        borderWidth: scale(1),
        backgroundColor: '#D9D9D9',
        marginBottom: scale(10),
        width: '100%',
    },
    buttonText: {
        fontFamily: 'League-Spartan-Light',
        fontSize: scale(25),
        padding: scale(15),
        paddingVertical: scale(25),
    },
    profileImage: {
        width: scale(120),
        height: scale(120),
        borderRadius: 100,
        backgroundColor: 'white',
    },
    imageContainer: {
        marginRight: scale(20),
    },
    textContainer: {
        flex: 1, // Take remaining space
    },
});


export default UserAccountSettingPage;