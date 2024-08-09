import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import DisplayFriendRequestsPresenter from '../../presenter/DisplayFriendRequestsPresenter';
import AcceptFriendPresenter from '../../presenter/AcceptFriendPresenter';
import RejectFriendPresenter from '../../presenter/RejectFriendPresenter';
import { scale } from "../../components/scale";

const UserFriendRequestPage = ({ route }) => {
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

  useEffect(() => {
    displayFriendRequestsPresenter.fetchRequests(user.accountID);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Friend Requests</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {requests.map((request, index) => (
          <View key={index} style={styles.requestContainer}>
            <Image style={styles.userImage} source={{ uri: request.profilePictureURL }} />
            <View style={styles.userDetails}>
              <Text style={styles.name}>{request.userID1}</Text>
              <Text style={styles.role}>User</Text>
              <View style={styles.optButtons}>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsText}>DETAILS</Text>
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
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C42847',
  },
  titleView: {
    backgroundColor: '#E28413',
    paddingVertical: scale(20),
    alignItems: 'center',
  },
  title: {
    fontSize: scale(36),
    fontWeight: 'bold',
    color: 'black',
  },
  scrollContainer: {
    paddingVertical: scale(20),
    paddingHorizontal: scale(15),
  },
  requestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C42847',
    marginBottom: scale(10),
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: scale(8),
  },
  userImage: {
    width: scale(100),
    height: scale(100),
    backgroundColor: 'white',
    marginRight: scale(15),
  },
  userDetails: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  name: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: 'white',
  },
  role: {
    fontSize: scale(15),
    color: 'white',
    marginVertical: scale(5),
  },
  optButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    width: scale(80),
    backgroundColor: '#D9D9D9',
    borderRadius: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  detailsText: {
    fontSize: scale(16),
    color: 'black',
  },
  acceptButton: {
    width: scale(80),
    backgroundColor: '#00AD3B',
    borderRadius: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  rejectButton: {
    width: scale(80),
    backgroundColor: '#E28413',
    borderRadius: scale(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteText: {
    fontSize: scale(16),
    color: 'white',
  },
});

export default UserFriendRequestPage;
