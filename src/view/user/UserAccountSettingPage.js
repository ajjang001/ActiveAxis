import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useFocusEffect, StackActions } from '@react-navigation/native';
import { TransitionPresets } from '@react-navigation/stack';
import { scale } from '../../components/scale';
import LogoutPresenter from '../../presenter/LogoutPresenter';
import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';

import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebaseConfig';

import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import RemoveAdsPresenter from '../../presenter/RemoveAdsPresenter';

const UserAccountSettingPage = ({ navigation, route }) => {

    const [user, setUser] = useState(route.params.user !== undefined ? route.params.user : null);
    const [userDetails, setuserDetails] = useState(null);
    const [imageURL, setImageURL] = useState('');

    const [ads, setAds] = useState(null);

    // get image url
    useFocusEffect(
        useCallback(() => {
            const getImageURL = async (c) => {
                try {
                    const storageRef = ref(storage, c.profilePicture);
                    const url = await getDownloadURL(storageRef);

                    if (userDetails && userDetails[0]?.user?.profilePicture) {
                        setImageURL(userDetails[0].user.profilePicture);
                    } else {
                        setImageURL(url);
                    }
                } catch (error) {
                    console.error("Error fetching image URL:", error);
                }
            };

            getImageURL(user);

        }, [user, userDetails]) // Dependencies to trigger reload
    );


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

    const getAdsRemoved = async () => {
        try {
            setAds(await new RemoveAdsPresenter().isAdRemoved(user.accountID));
        } catch (error) {
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    }

    const setAdsRemoved = async () => {
        try {
            changeLoadingVisible(true);
            setAds(await new RemoveAdsPresenter().setAdsRemoved(user.accountID));
        } catch (error) {
            changeModalVisible(true, error.message.replace('Error: ', ''));
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
                setuserDetails(route.params.userDetails !== undefined ? route.params.userDetails : null);
                setModalVisible(false);
            };
        }, [route.params.user, route.params.userDetails])
    );


    useFocusEffect(
        useCallback(() => {
            getAdsRemoved();
        }, [])
    );

    // Options for the user
    const options = [
        { label: 'Account Details', onPress: () => navigation.navigate("UserAccountDetailsPage1", { user, userType: 'user' }) },
        { label: 'Exercise Settings', onPress: () => navigation.navigate("UserExerciseSettingsPage", { user, userType: 'user' }) },
        { label: 'Friends', onPress: () => navigation.navigate("UserFriendsListPage", { user }) },
        { label: 'App Feedbacks', onPress: () => navigation.navigate("UserAppFeedbackPage", { user }) }, ,
        { label: 'Achievements', onPress: () => navigation.navigate("UserAchievementPage", { user }) },
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
                        {!ads && (
                            <View>
                                <TouchableOpacity style={styles.upgradeButton} onPress={() => setAdsRemoved()}>
                                    <Text style={styles.upgradeText}>Remove Advertisements</Text>
                                </TouchableOpacity>
                            </View>
                        )}
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
            {!ads && (
                <View style={styles.adContainer}>
                    <BannerAd
                        unitId={'ca-app-pub-3940256099942544/6300978111'} // Test ad unit ID
                        size={BannerAdSize.FULL_BANNER} // Adjust size as needed
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                        }}
                        onAdLoaded={() => {
                            console.log('Banner ad loaded');
                        }}
                        onAdFailedToLoad={(error) => {
                            console.error('Failed to load banner ad:', error);
                        }}
                    />
                </View>
            )}
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
        marginTop: scale(50),
    },
    profileContainer: {
        padding: scale(20),
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
        marginTop: scale(10),
        marginRight: scale(20),
    },
    textContainer: {
        flex: 1, // Take remaining space
    },
    upgradeButton: {
        backgroundColor: '#4CAF50', // Green color
        paddingVertical: scale(10),
        marginTop: scale(5),
        width: '60%',
        borderRadius: scale(5),
        alignItems: 'center',
        //alignSelf: 'flex-end'
    },
    upgradeText: {
        color: 'white',
        fontSize: scale(12),
        fontWeight: 'bold',
    },
    adContainer: {
        width: '100%', 
        alignItems: 'center',
        padding: scale(5), 
      },
});


export default UserAccountSettingPage;