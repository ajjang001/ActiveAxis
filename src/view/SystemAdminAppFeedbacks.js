import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Modal, ScrollView } from 'react-native';
import FeedbackCard from '../components/FeedbackCard';
import DisplayFeedbacksPresenter from '../presenter/DisplayFeedbacksPresenter';
import { ActionDialog, LoadingDialog, MessageDialog } from '../components/Modal';

import {scale} from '../components/scale';

const SystemAdminAppFeedbacks = () => {
  // state variables
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // change popup/modal visible
  const changeModalVisible = (b, m)=>{
    setModalMsg(m);
    setModalVisible(b);
  }
  
  // load feedbacks
  const presenter = new DisplayFeedbacksPresenter({
    displayFeedbacks: (data) => {
      setFeedback(data);
      setLoading(false);
    },
    displayError: (message) => {
      changeModalVisible(true, message);
      setLoading(false);
    },
  });

  // load feedbacks presenter
  useEffect(() => {
    setLoading(true);
    presenter.loadFeedbacks();
  }, []);

  // change popup/modal visible
  const changeLoadingVisible = (b)=>{
    setLoading(b);
}

  if (loading) {
    return (
      <Modal transparent={true} animationType='fade' visible={loading} nRequestClose={()=>changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle = {styles.contentContainer}>
      <Text style={styles.title}>App Feedbacks</Text>
      {feedback.map((feedbackItem, index) => (
      <FeedbackCard
        key={index}
        avatar={feedbackItem.profilePicture || feedbackItem.avatar}
        name={feedbackItem.fullName || feedbackItem.name}
        rating={feedbackItem.rating}
        feedback={feedbackItem.feedbackText}
      />
    ))}

      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
        <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: scale(20),
    backgroundColor: '#FBF5F3',
  },
  contentContainer:{
    alignItems: 'center',
  },
  title: {
    fontSize: scale(30),
    fontWeight: 'bold',
    marginBottom: scale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SystemAdminAppFeedbacks;
