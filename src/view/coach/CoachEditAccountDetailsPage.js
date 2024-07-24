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
  // const [password, setPassword] = useState('');
  // const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber);
  const [tempEmail, setTempEmail] = useState(email);
  // const [tempPassword, setTempPassword] = useState(password);

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
      // setPassword(accountDetails.password); // If you want to handle passwords
      setTempName(accountDetails.fullName);
      setTempPhoneNumber(accountDetails.phoneNumber);
      setTempEmail(accountDetails.email);
      // setTempPassword(accountDetails.password); // If you want to handle passwords
    }
  });

  useEffect(() => {
    if (userEmail && userType) {
      presenter.getCoachDetails(userEmail).catch((error) => {
        console.error("Error in presenter:", error.message);
      });
    }
  }, [userEmail, userType]);

  const handleSave = () => {
    setModalVisible(true);
  };

  const handleConfirmSave = () => {
    presenter.updateCoachAccountDetails(
      userEmail,
      tempName,
      tempPhoneNumber,
      tempEmail
    ).then(() => {
      navigation.goBack();
    }).catch((error) => {
      console.error("Error updating account details:", error.message);
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
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
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
    padding: 20,
    backgroundColor: '#FDF4F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#C53A45',
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    flex: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CoachEditAccountDetailsPage;
