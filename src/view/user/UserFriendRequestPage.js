import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import { scale } from "../../components/scale";
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import DisplayFriendRequestsPresenter from "../../presenter/DisplayFriendRequestsPresenter";
import AcceptFriendPresenter from "../../presenter/AcceptFriendPresenter";
import RejectFriendPresenter from "../../presenter/RejectFriendPresenter";

const UserFriendRequestPage = ({ route, navigation }) => {
    // state variables
    const { user } = route.params;
    const [friendRequests, setFriendRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

    // change popup/modal visible
    const changeModalVisible = (b, m) => {
        setModalMsg(m);
        setModalVisible(b);
    }

    // change loading visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    const displayFriendRequests = async () => {
        try {
            changeLoadingVisible(true);
            setFriendRequests([]);
            await new DisplayFriendRequestsPresenter({ updateFriendRequests: setFriendRequests }).getFriendRequests(user.accountID);
        } catch (error) {
            changeModalVisible(true, error.message.replace('Error: ', ''));
        } finally {
            changeLoadingVisible(false);
        }
    }    
    

    const acceptFriendRequest = async (friend) => {
        try {
            const acceptFriendRequestPresenter = new AcceptFriendPresenter();
            await acceptFriendRequestPresenter.acceptRequest(user.accountID, friend.accountID);
            changeModalVisible(true, 'Friend Request Accepted');
            displayFriendRequests();
        } catch (error) {
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    }
    
    const rejectFriendRequest = async (friend) => {
        try {
            const rejectFriendRequestPresenter = new RejectFriendPresenter();
            await rejectFriendRequestPresenter.rejectRequest(user.accountID, friend.accountID);
            changeModalVisible(true, 'Friend Request Rejected');
            displayFriendRequests();
        } catch (error) {
            changeModalVisible(true, error.message.replace('Error: ', ''));
        }
    }
    

    useEffect(() => {
        displayFriendRequests();
    }, []);

    return (
        <View>
            <View style={styles.titleView}>
                <Text style={styles.title}>Friend Request</Text>
            </View>
            <Modal transparent={true} animationType='fade' visible={isLoading} onRequestClose={() => changeLoadingVisible(false)}>
                <LoadingDialog />
            </Modal>
            <Modal transparent={true} animationType='fade' visible={modalVisible} onRequestClose={() => changeModalVisible(false)}>
                <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
            </Modal>

            <View style={styles.contentContainer}>
                <View style={styles.middleContentContainer}>
                    <ScrollView style={styles.userListContainer} contentContainerStyle={styles.userListContent}>
                        {friendRequests.length == 0 ?
                            <View>
                                <Text style={{ color: 'white', fontSize: scale(20) }}>No friend requests found</Text>
                            </View>
                            :
                            friendRequests.map((friend, index) => {
                                return (
                                    <View style={styles.usersContainer} key={index}>
                                        <Image source={{ uri: friend.profilePicture }} resizeMode='stretch' style={styles.userImage} />
                                        <View style={styles.userDetails}>
                                            <Text style={styles.name}>{friend.fullName}</Text>
                                            <Text style={styles.role}>User</Text>
                                            <View style={styles.optButtons}>
                                                <TouchableOpacity onPress={() => acceptFriendRequest(friend)} activeOpacity={0.7} style={styles.acceptButton}>
                                                    <Text style={styles.acceptText}>ACCEPT</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => rejectFriendRequest(friend)} activeOpacity={0.7} style={styles.rejectButton}>
                                                    <Text style={styles.rejectText}>REJECT</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleView: {
        backgroundColor: '#E28413',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(10),
        paddingVertical: scale(10),
    },
    title: {
        fontSize: scale(36),
        fontFamily: 'League-Spartan',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentContainer: {
        backgroundColor: '#C42847',
        height: '100%',
        width: '100%',
    },
    middleContentContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userListContainer: {
        height: '85%',
        width: '85%',
    },
    userListContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    usersContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: scale(15),
    },
    userImage: {
        width: scale(100),
        height: scale(100),
        backgroundColor: 'white',
    },
    userDetails: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'column',
        gap: scale(10),
        height: scale(100),
    },
    name: {
        fontFamily: 'League-Spartan-SemiBold',
        fontSize: scale(15),
        backgroundColor: 'white',
        width: scale(275),
        paddingHorizontal: scale(5),
    },
    role: {
        fontFamily: 'League-Spartan-SemiBold',
        fontSize: scale(13),
        backgroundColor: 'white',
        width: scale(275),
        padding: scale(5),
    },
    optButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: scale(275),
    },
    acceptButton: {
        width: scale(100),
        backgroundColor: '#00AD3B',
        paddingVertical: scale(5),
        borderRadius: scale(8),
        marginRight: scale(10),
    },
    acceptText: {
        fontFamily: 'League-Spartan-SemiBold',
        fontSize: scale(15),
        color: 'white',
        textAlign: 'center',
    },
    rejectButton: {
        width: scale(100),
        backgroundColor: '#E28413',
        paddingVertical: scale(5),
        borderRadius: scale(8),
    },
    rejectText: {
        fontFamily: 'League-Spartan-SemiBold',
        fontSize: scale(15),
        color: 'white',
        textAlign: 'center',
    }
});

export default UserFriendRequestPage;
