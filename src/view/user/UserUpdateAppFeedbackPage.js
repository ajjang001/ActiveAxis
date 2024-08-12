import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale } from '../../components/scale';

import { LoadingDialog, ActionDialog, MessageDialog } from '../../components/Modal';

import UpdateAppFeedbackPresenter from '../../presenter/UpdateAppFeedbackPresenter';

const UserUpdateAppFeedbackPage = ({ route, navigation }) => {
  const { feedback, user } = route.params;
  const [rating, setRating] = useState(feedback !== null ? feedback.rating : 0);
  const [feedbackText, setFeedbackText] = useState(feedback !== null ? feedback.feedbackText : '');

  
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

  const handleSave = async() => {
    try{
      changeLoadingVisible(true);
      await new UpdateAppFeedbackPresenter({feedback: feedback}).updateFeedback(feedbackText, rating);
      Alert.alert('Success', 'Feedback updated successfully');
      navigation.navigate('UserAppFeedbackPage', {refresh: true, user});
      
    }catch (e){
      changeModalVisible(true, e.message);
    }finally{
      changeLoadingVisible(false);
    }
  }




  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
          <Icon
            name="star"
            size={scale(30)}
            color={i < rating ? '#FFD700' : '#D3D3D3'}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Feedback</Text>
      <View style={styles.starsContainer}>{renderStars()}</View>
      <TextInput
        style={styles.textInput}
        placeholder="Enter reviews here"
        placeholderTextColor="#666"
        multiline
        value={feedbackText}
        onChangeText={setFeedbackText}
      />
      <TouchableOpacity style={styles.submitButton} onPress={()=>changeConfirmVisible(true, 'Do you want to save changes?')}>
        <Text style={styles.submitButtonText}>SAVE</Text>
      </TouchableOpacity>

        <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
            <LoadingDialog />
        </Modal>
        <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
            <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
        </Modal>
        <Modal transparent={true} animationType='fade' visible={confirmationVisible} nRequestClose={()=>changeModalVisible(false)}>
            <ActionDialog
                message = {confirmMessage}
                changeModalVisible = {changeConfirmVisible}
                action = {handleSave}
            />
        </Modal>

        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#B63232',
    borderRadius: 10,
    padding: scale(20),
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: scale(50),
  },
  title: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: scale(20),
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: scale(20),
  },
  star: {
    marginHorizontal: scale(5),
  },
  textInput: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: scale(10),
    width: '100%',
    height: scale(100),
    textAlignVertical: 'top',
    color: '#000',
    marginBottom: scale(20),
  },
  submitButton: {
    backgroundColor: '#DA872A',
    borderRadius: 10,
    paddingVertical: scale(10),
    paddingHorizontal: scale(30),
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(16),
  }
});

export default UserUpdateAppFeedbackPage;
