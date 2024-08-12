import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import DisplayFriendRequestsPresenter from '../../presenter/DisplayFriendRequestsPresenter';
import AcceptFriendPresenter from '../../presenter/AcceptFriendPresenter';
import RejectFriendPresenter from '../../presenter/RejectFriendPresenter';
import { scale } from "../../components/scale";

const UserFriendRequestPage = ({ route, navigation }) => {
  const { user } = route.params;
  const [requests, setRequests] = useState([]);

  const displayFriendRequestsPresenter = new DisplayFriendRequestsPresenter({
    onRequestsFetched: (requests) => {
      setRequests(requests);
    },
    showError: (message) => {
      console.error(message);
    },
  });

  const acceptFriendPresenter = new AcceptFriendPresenter({
    onFriendAccepted: (friendId) => {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.userID1 !== friendId)
      );
    },
    showError: (message) => {
      console.error(message);
    },
  });

  const rejectFriendPresenter = new RejectFriendPresenter({
    onFriendRejected: (friendId) => {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.userID1 !== friendId)
      );
    },
    showError: (message) => {
      console.error(message);
    },
  });

  const viewDetails = (friend) => {
    // Navigate to the details page
    // console.log(friend);
    navigation.navigate('UserFriendDetailsPage', { friend });
  }

  useEffect(() => {
    displayFriendRequestsPresenter.fetchRequests(user.accountID);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>Friend Requests</Text>
                </View>
                <View style={styles.middleContentContainer}>
                    <ScrollView style={styles.userListContainer} contentContainerStyle={styles.userListContent}>
                        {requests.length === 0 ? (
                            <View>
                                <Text style={{ color: 'white', fontSize: scale(20) }}>No friend requests</Text>
                            </View>
                        ) : (
                            requests.map((request, index) => (
                                <View style={styles.usersContainer} key={index}>
                                    <Image source={{ uri: request.profilePictureURL }} resizeMode='stretch' style={styles.userImage} />
                                    <View style={styles.userDetails}>
                                        <Text style={styles.name}>{request.fullName}</Text>
                                        <Text style={styles.role}>User</Text>
                                        <View style={styles.optButtons}>
                                            <TouchableOpacity onPress={() => viewDetails(request)} activeOpacity={0.7} style={[styles.detailsButton]}>
                                              <Text style={styles.detailsText}>Details</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => acceptFriendPresenter.acceptFriend(user.accountID, request.userID1)}
                                                style={styles.acceptButton}
                                            >
                                                <Text style={styles.inviteText}>Accept</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => rejectFriendPresenter.rejectFriend(user.accountID, request.userID1)}
                                                style={styles.rejectButton}
                                            >
                                                <Text style={styles.inviteText}>Reject</Text>
                                            </TouchableOpacity>
                                            </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: scale(2),
      backgroundColor: '#E28413',
  },
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
      width: '100%',
      height: '85%',
  },
  middleContentContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  userListContainer: {
      height: '65%',
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
  detailsButton: {
      width: scale(90),
      backgroundColor: "#D9D9D9",
      borderRadius: scale(6),
  },
  detailsText: {
      fontFamily: 'League-Spartan-SemiBold',
      fontSize: scale(16),
      textAlign: 'center',
  },
  acceptButton: {
      width: scale(90),
      backgroundColor: "#00AD3B",
      borderRadius: scale(6),
  },
  rejectButton: {
      width: scale(90),
      backgroundColor: "#E28413",
      borderRadius: scale(6),
  },
  inviteText: {
      fontFamily: 'League-Spartan-SemiBold',
      fontSize: scale(15),
      color: 'white',
      textAlign: 'center',
  },
});

export default UserFriendRequestPage;
