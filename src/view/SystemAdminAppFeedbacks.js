import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Modal, ScrollView } from 'react-native';
import FeedbackCard from '../components/FeedbackCard';
import DisplayFeedbacksPresenter from '../presenter/DisplayFeedbacksPresenter';
import { LoadingDialog } from '../components/Modal';

const SystemAdminAppFeedbacks = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const presenter = new DisplayFeedbacksPresenter({
    displayFeedbacks: (data) => {
      setFeedback(data);
      setLoading(false);
    },
    displayError: (message) => {
      console.error(message);
      setLoading(false);
    },
  });

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
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#FBF5F3',
  },
  contentContainer:{
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SystemAdminAppFeedbacks;
