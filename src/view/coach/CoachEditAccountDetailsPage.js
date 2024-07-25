import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import UpdateAccountDetailsPresenter from '../../presenter/UpdateAccountDetailsPresenter';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';
import { scale } from '../../components/scale';


const CoachEditAccountDetailsPage = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Initialize navigation
  const { userEmail, userType } = route.params;

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [tempName, setTempName] = useState(name);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber);
  const [tempEmail, setTempEmail] = useState(email);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  // change popup/modal visible
  const changeLoadingVisible = (b)=>{
      setIsLoading(b);
  }

  // change popup/modal visible
  const changeModalVisible = (b, m)=>{
      setModalMsg(m);
      setModalVisible(b);
  }

  // change popup/modal visible
  const changeConfirmVisible = (b, m)=>{
      setConfirmMessage(m);
      setConfirmationVisible(b);
  }



  const presenter = new UpdateAccountDetailsPresenter({
    displayAccountDetails: (accountDetails) => {
      console.log("Displaying account details:", accountDetails);
      setName(accountDetails.fullName);
      setPhoneNumber(accountDetails.phoneNumber);
      setEmail(accountDetails.email);
      setTempName(accountDetails.fullName);
      setTempPhoneNumber(accountDetails.phoneNumber);
      setTempEmail(accountDetails.email);
    }
  });

  useEffect(() => {
    if (userEmail && userType) {
      presenter.getCoachDetails(userEmail).catch((error) => {
        console.error("Error in presenter:", error.message);
      });
    }
  }, [userEmail, userType]);


  const handleConfirmSave = () => {
    setIsLoading(true);
    presenter.updateCoachAccountDetails(
      userEmail,
      tempName,
      tempPhoneNumber,
      tempEmail
    ).then(() => {
      presenter.updateCoachPassword(
        userEmail,
        newPassword,
        confirmNewPassword
    ).then(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Account details and password updated successfully!');
        navigation.goBack();
    }).catch((error) => {
        setIsLoading(false);
        console.error("Error updating password:", error.message);
        Alert.alert('Error', error.message || 'An unknown error occurred while updating the password.');
    });
  }).catch((error) => {
     setIsLoading(false);
     console.error("Error updating account details:", error.message);
     Alert.alert('Error', error.message || 'An unknown error occurred while updating the account details.');
  });

  setModalVisible(false);
  };


  const handleCancelSave = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={tempName}
            onChangeText={setTempName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={tempPhoneNumber}
            onChangeText={setTempPhoneNumber}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={tempEmail}
            onChangeText={setTempEmail}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry={true}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleConfirmSave}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>

      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
          <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeModalVisible(false)}>
          <ActionDialog
              message = {confirmMessage}
              changeModalVisible = {changeConfirmVisible}
              action = {handleConfirmSave}
          />
      </Modal>

      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Do you want to save changes?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCancelSave}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
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
    borderWidth: scale(2),
    borderColor: '#C53A45',
    borderRadius: scale(10),
    backgroundColor: '#F1F1F1',
  },
  inputGroup: {
    marginBottom: scale(15),
  },
  label: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: scale(5),
  },
  input: {
    height: scale(40),
    borderColor: '#CCCCCC',
    borderWidth: scale(1),
    paddingHorizontal: scale(10),
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: scale(20),
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingVertical: scale(10),
    paddingHorizontal: scale(40),
    borderRadius: scale(5),
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
  modalContainer: {
    flex: scale(1),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: scale(300),
    backgroundColor: 'white',
    borderRadius: scale(10),
    padding: scale(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: scale(0),
      height: scale(2),
    },
    shadowOpacity: scale(0.25),
    shadowRadius: scale(4),
    elevation: scale(5),
  },
  modalText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    marginBottom: scale(20),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: scale(5),
    padding: scale(10),
    marginHorizontal: scale(10),
    alignItems: 'center',
    flex: scale(1),
  },
  modalButtonText: {
    fontSize: scale(16),
    fontWeight: 'bold',
  },
});

export default CoachEditAccountDetailsPage;
