import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SendAppFeedbackPresenter from '../../presenter/SendAppFeedbackPresenter';
import { getAuth } from 'firebase/auth';
import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';

import { scale } from '../../components/scale';

const CoachSendAppFeedbackPage = ({navigation, route}) => {
  const {coach} = route.params;

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

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

  const presenter = new SendAppFeedbackPresenter({
    onFeedbackSubmitted: () => {
      Alert.alert('Success', 'Feedback submitted successfully');
      setRating(0);
      setFeedback('');
    },
    displayFeedbacks: (feedbackList) => {
      // Handle displaying the feedbacks
      console.log(feedbackList);
    }
  });

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
          <Icon
            name="star"
            size={30}
            color={i < rating ? '#FFD700' : '#D3D3D3'}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleSubmit = async () => {
    try {
      changeLoadingVisible(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const dateSubmitted = new Date().toLocaleString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: 'numeric', 
          second: 'numeric', 
          timeZoneName: 'short'
        });
        const feedbackData = {
          dateSubmitted: dateSubmitted,
          feedbackText: feedback,
          rating: rating,
          accountID: user.uid, // Use the authenticated user's UID
        };
        await presenter.submitFeedback(feedbackData);

        navigation.navigate('CoachAppFeedbackPage', {refresh: true, coach});
      } else {
        changeModalVisible(true, 'You must be logged in to submit feedback');
      }
    } catch (error) {
      changeModalVisible(true, error.message.replace('Error: ', ''));
    }finally{
      changeLoadingVisible(false);
    }
  };

  return (
    <View style = {{backgroundColor: '#FBF5F3'}}>
      <View style={styles.container}>
        <Text style={styles.title}>App Feedback</Text>
        <View style={styles.starsContainer}>{renderStars()}</View>
        <TextInput
          style={styles.textInput}
          placeholder="Enter reviews here"
          placeholderTextColor="#666"
          multiline
          value={feedback}
          onChangeText={setFeedback}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
      
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
          <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#B63232',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  textInput: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    height: 100,
    textAlignVertical: 'top',
    color: '#000',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#DA872A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CoachSendAppFeedbackPage;
