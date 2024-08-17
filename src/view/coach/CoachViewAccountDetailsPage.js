import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import DisplayAccountDetailsPresenter from '../../presenter/DisplayAccountDetailsPresenter';
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { scale } from '../../components/scale';

const CoachViewAccountDetailsPage = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Initialize navigation
  const { userEmail, userType } = route.params;

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setprofilePic] = useState('');

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

  useFocusEffect(
    useCallback(() => {
      const fetchAccountDetails = async () => {
        try {
          setIsLoading(true);
          if (userEmail && userType) {
            const presenter = new DisplayAccountDetailsPresenter({
              displayAccountDetails: (accountDetails) => {
                console.log("Displaying account details:", accountDetails);
                setName(accountDetails.fullName);
                setPhoneNumber(accountDetails.phoneNumber);
                setEmail(accountDetails.email);
                setprofilePic(accountDetails.profilePicture);
              }
            });
  
            await presenter.viewAccountDetails(userEmail, userType);
          }
        } catch (error) {
          console.error("Error in presenter:", error.message);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchAccountDetails();
    }, [userEmail, userType])
);

  const handleEdit = () => {
    navigation.navigate('CoachEditAccountDetailsPage', { userEmail, userType });
  };

  return (
    <View style={styles.container}>
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
        <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
        <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
      </Modal>
      <Text style={styles.title}>Account Details</Text>
      <View style={styles.formContainer}>
      {profilePic !== '' ? (
            <View style={styles.pictureContainer}>
              <Image source={{ uri: profilePic }} resizeMode='stretch' style={styles.coachImage} />
            </View>
          ) : (
            <ActivityIndicator style={styles.pictureContainer} size="large" />
          )}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={false}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={false}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={false}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>EDIT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    backgroundColor: '#FDF4F1',
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: scale(20),
  },
  formContainer: {
    padding: scale(20),
    borderWidth: 2,
    borderColor: '#C53A45',
    borderRadius: scale(10),
    backgroundColor: '#F1F1F1',
  },
  inputGroup: {
    marginBottom: scale(15),
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: scale(5),
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingHorizontal: scale(10),
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: scale(20),
    alignSelf: 'center',
    backgroundColor: '#E28413',
    paddingVertical: scale(10),
    paddingHorizontal: scale(40),
    borderRadius: scale(5),
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  pictureContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  coachImage: {
    width: scale(100),
    height: scale(100),
    backgroundColor: 'white',
    borderRadius: scale(75)
  },
});

export default CoachViewAccountDetailsPage;
