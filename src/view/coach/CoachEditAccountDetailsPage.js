import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator, Image } from 'react-native';
import UpdateAccountDetailsPresenter from '../../presenter/UpdateAccountDetailsPresenter';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LoadingDialog, MessageDialog, ActionDialog } from '../../components/Modal';
import { launchImageLibrary } from 'react-native-image-picker';
import { scale } from '../../components/scale';

const CoachEditAccountDetailsPage = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Initialize navigation
  const { userEmail, userType } = route.params;

  const [coachID, setcoachID] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmnewPassword, setConfirmNewPassword] = useState('');
  const [tempName, setTempName] = useState(name);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber);
  const [tempEmail, setTempEmail] = useState(email);

  const [profilePic, setprofilePic] = useState('');
  const [newprofilePic, setnewprofilePic] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // change popup/modal visible
  const changeModalVisible = (b, m) => {
    setModalMsg(m);
    setModalVisible(b);
  }

  // change popup/modal visible
  const changeModal1Visible = (b, m) => {
    setModalMsg(m);
    setModal1Visible(b);
  }


  // change popup/modal visible
  const changeLoadingVisible = (b) => {
    setIsLoading(b);
  }


  const presenter = new UpdateAccountDetailsPresenter({
    displayAccountDetails: (accountDetails) => {
      // console.log("Displaying account details:", accountDetails);
      setName(accountDetails.fullName);
      setPhoneNumber(accountDetails.phoneNumber.substring(3));
      setEmail(accountDetails.email);
      setTempName(accountDetails.fullName);
      setTempPhoneNumber(accountDetails.phoneNumber.substring(3));
      setTempEmail(accountDetails.email);
      setcoachID(accountDetails.accountID);
      setprofilePic(accountDetails.profilePicture);
      setnewprofilePic(accountDetails.profilePicture);
    }
  });

  useEffect(() => {
    if (userEmail && userType) {
      presenter.getCoachDetails(userEmail).catch((error) => {
        console.error("Error in presenter:", error.message);
      });
    }
  }, [userEmail, userType]);


  const handleConfirmSave = async () => {
    setIsLoading(true);
    changeLoadingVisible(true);
    try {
      await new UpdateAccountDetailsPresenter().updateCoachAccountDetails(userEmail, tempName, "+65" + tempPhoneNumber, tempEmail, coachID, newPassword, confirmnewPassword, profilePic, newprofilePic)
      Alert.alert('Successfully updated account information!')
      navigation.navigate('CoachViewAccountDetailsPage', { userEmail, userType })
    } catch (e) {
      console.log(e);
      changeModal1Visible(true, e.message.replace('Error: ', ''));
      //Alert.alert(e.message);
    } finally {
      changeLoadingVisible(false);
    };

    setModalVisible(false);
  };

 // handle select photo
const handleSelectPhoto = async () => {
  try {
    const response = await launchImageLibrary({ mediaType: 'photo' });

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.error('ImagePicker Error: ', response.errorMessage);
    } else {
      const asset = response.assets[0];
      const uri = asset.uri;
      let name = asset.fileName || uri.split('/').pop();
      const ext = name.split('.').pop();
      name = `photo.${ext}`;
      
      setnewprofilePic(uri);
    }
  } catch (error) {
    console.error('Error selecting photo:', error.message);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <View style={styles.formContainer}>
        <TouchableOpacity  onPress={() => handleSelectPhoto()}>
          {newprofilePic !== '' ? (
            <View style={styles.pictureContainer}>
              <Image source={{ uri: newprofilePic }} resizeMode='stretch' style={styles.coachImage} />
            </View>
          ) : (
            <ActivityIndicator style={styles.pictureContainer} size="large" />
          )}
        </TouchableOpacity>
        <Text style={styles.detailsTitle}>Name</Text>
        <Text style={styles.detailsText}>{name}</Text>
        <Text style={styles.detailsTitle}>Email</Text>
        <Text style={styles.detailsText}>{email}</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneContainer}>
            <Text style={styles.countryCode}>+65</Text>
            <TextInput
              style={styles.phoneinput}
              keyboardType="phone-pad"
              maxLength={8}
              returnKeyType='done'
              value={tempPhoneNumber}
              onChangeText={text => setTempPhoneNumber(text)}
            />
          </View>
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
            editable={newPassword.trim() !== ''}
            style={styles.input}
            value={confirmnewPassword}
            onChangeText={setConfirmNewPassword}
            secureTextEntry={true}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => changeModalVisible(true, 'Do you want to save changes?')}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
        <ActionDialog
          message={modalMsg}
          changeModalVisible={changeModalVisible}
          action={handleConfirmSave}
        />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
        <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modal1Visible} nRequestClose={() => changeModal1Visible(false)}>
        <MessageDialog
          message={modalMsg}
          changeModalVisible={changeModal1Visible}
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
    flex: scale(1),
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
    borderRadius: scale(8),
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
  detailsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: scale(16),
    marginVertical: scale(2),
  },
  detailsText: {
    fontFamily: 'Inter',
    fontSize: scale(16),
    marginBottom: scale(5),
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderRadius: scale(8),
    borderColor: '#CCCCCC',
    borderWidth: scale(1),
    backgroundColor: '#F5F5F5', // Light gray background to indicate it's not editable
    color: '#999999', // Muted text color
  },
  phoneinput: {
    backgroundColor: 'white',
    paddingHorizontal: scale(15),
    borderRadius: scale(8),
    borderColor: '#CCCCCC',
    borderWidth: scale(1),
    flex: 1,
  },
  phoneContainer: {
    flexDirection: 'row',
  },
  countryCode: {
    fontFamily: 'Inter',
    fontSize: scale(16),
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderRadius: scale(8),
    marginRight: scale(5),
    borderColor: '#CCCCCC',
    borderWidth: scale(1),
    backgroundColor: '#F5F5F5', // Light gray background to indicate it's not editable
    color: '#999999', // Muted text color
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

export default CoachEditAccountDetailsPage;
