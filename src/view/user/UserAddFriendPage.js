import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import AddFriendPresenter from "../../presenter/AddFriendPresenter";
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import { scale } from "../../components/scale";

const UserAddFriendPage = ({ route, navigation }) => {
  const { user } = route.params;
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  // change popup/modal visible
  const changeConfirmVisible = (b, m)=>{
    setConfirmMessage(m);
    setConfirmationVisible(b);
    }

  // change popup/modal visible
  const changeModalVisible = (b, m)=>{
    setModalMsg(m);
    setModalVisible(b);
    }

  // change popup/modal visible
  const changeLoadingVisible = (b)=>{
    setIsLoading(b);
    }

  const presenter = new AddFriendPresenter({
    updateFriendStatus: (userId, status) => {
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          user.status = status;
        }
        return user;
      });
      setUsers(updatedUsers);
    },
    showError: (message) => {
      setModalMsg(message);
      setModalVisible(true);
    },
  });

  const searchHandler = async () => {
    setIsLoading(true);
    try {
      const result = await presenter.model.searchUsers(search, user.accountID);
      console.log('Fetched Users:', result); // Debugging line
      setUsers(result);
    } catch (error) {
      console.error(error);
      presenter.view.showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const viewDetails = (userId) => {
    // Navigate to the details page
    navigation.navigate('UserDetailsPage', { userId });
  }

  const addFriend = async (userId) => {
    try {
        await presenter.addFriend(user.accountID, userId);
        const updatedUsers = users.map((user) =>
            user.id === userId ? { ...user, status: "Pending" } : user
        );
        setUsers(updatedUsers);
    } catch (error) {
        presenter.view.showError(error.message);
    }
  };


  const cancelFriendRequest = (userId) => {
    presenter.cancelFriendRequest(user.accountID, userId);
  };  

  useEffect(() => {
    const fetchInitialUsers = async () => {
      setIsLoading(true);
      try {
        const result = await presenter.model.searchUsers('', user.accountID);
        console.log('Initial Users:', result); // Debugging line
        setUsers(result);
      } catch (error) {
        console.error(error);
        presenter.view.showError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchInitialUsers();
  }, []);
  
  return (
    <View>
      <View style={styles.titleView}>
        <Text style={styles.title}>Search User</Text>
      </View>
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
        <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
        <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
      </Modal>
      <View style={styles.contentContainer}>
        <View style={styles.topContentContainer}>
          <View style={styles.searchBarContainer}>
            <Image style={styles.searchLogo} source={require('../../../assets/search_icon.png')} />
            <TextInput onEndEditing={searchHandler} onChangeText={setSearch} value={search} placeholder="Search User" />
          </View>
        </View>
        <View style={styles.middleContentContainer}>
          <ScrollView style={styles.userListContainer} contentContainerStyle={styles.userListContent}>
            {users.length === 0 ? (
              <View>
                <Text style={{ color: 'white', fontSize: scale(20) }}>No user found</Text>
              </View>
            ) : (
              users.map((user, index) => (
                <View style={styles.usersContainer} key={index}>
                  <Image source={{ uri: user.profilePictureURL }} resizeMode="stretch" style={styles.userImage} />
                  <View style={styles.userDetails}>
                    <Text style={styles.name}>{user.fullName}</Text>
                    <Text style={styles.role}>User</Text>
                    <View style={styles.optButtons}>
                    <TouchableOpacity onPress={() => viewDetails(user)} activeOpacity={0.7} style={[styles.detailsButton]}>
                         <Text style={styles.detailsText}>DETAILS</Text>
                    </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => (user.status === "Pending" ? cancelFriendRequest(user.id) : addFriend(user.id))}
                        activeOpacity={0.7}
                        style={[
                          { width: scale(100), borderRadius: scale(8) },
                          user.status === "Pending" ? { backgroundColor: "#000000" } : { backgroundColor: "#00AD3B" },
                        ]}
                      >
                        <Text style={styles.inviteText}>{user.status === "Pending" ? "PENDING" : "ADD"}</Text>
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
  titleView: {
    backgroundColor: '#E28413',
  },
  title: {
    fontSize: scale(36),
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: scale(20),
  },
  contentContainer: {
    backgroundColor: '#C42847',
    height: '100%',
    width: '100%',
  },
  topContentContainer: {
    width: '100%',
    marginVertical: scale(20),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    width: '85%',
    padding: scale(5),
    borderRadius: scale(20),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(5),
    backgroundColor: 'white',
  },
  searchLogo: {
    width: scale(20),
    height: scale(20),
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
    fontSize: scale(15),
    backgroundColor: 'white',
    width: scale(275),
    paddingHorizontal: scale(5),
  },
  role: {
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
    width: scale(100),
    backgroundColor: "#D9D9D9",
    borderRadius: scale(6),
},
  detailsText: {
    fontFamily: 'League-Spartan-SemiBold',
    fontSize: scale(16),
    textAlign: 'center',
},
  inviteText: {
    fontSize: scale(16),
    color: 'white',
    textAlign: 'center',
  },
});

export default UserAddFriendPage;
