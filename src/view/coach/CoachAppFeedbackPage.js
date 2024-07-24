import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity, Modal } from 'react-native';
import { getAuth } from 'firebase/auth';
import FeedbackCard from '../../components/FeedbackCard';
import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';

import SendAppFeedbackPresenter from '../../presenter/SendAppFeedbackPresenter';

const CoachAppFeedbackPage = ({ navigation }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  
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
    displayFeedbacks: (feedbackList) => {
      if (user) {
        const userFeedbacks = feedbackList.filter(feedback => feedback.accountID === user.uid);
        setFeedbacks(userFeedbacks);
      }
    }
  });

  const handlePresenter = async ()=>{
    try{
      changeLoadingVisible(true);
      await presenter.fetchFeedbacks();
    }catch(e){
      changeModalVisible(true, e.message);
    }finally{
      changeLoadingVisible(false);
    }
  }


  

  useEffect(() => {
    handlePresenter();
  }, []);

  const handleEdit = (feedback) => {
    navigation.navigate('CoachUpdateAppFeedbackPage', { feedbackId: feedback.id });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
          <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
      </Modal>
      {feedbacks.map((feedback, index) => (
        <FeedbackCard
          key={index}
          avatar={feedback.profilePicture}
          name={feedback.fullName}
          rating={feedback.rating}
          feedback={feedback.feedbackText}
        />
      ))}
      <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(feedbacks)}>
            <Text style={styles.editButtonText}>EDIT</Text>
          </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#DA872A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    alignSelf: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CoachAppFeedbackPage;
