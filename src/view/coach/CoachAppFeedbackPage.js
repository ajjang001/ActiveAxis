import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import FeedbackCard from '../../components/FeedbackCard';
import SendAppFeedbackPresenter from '../../presenter/SendAppFeedbackPresenter';

const CoachAppFeedbackPage = ({ navigation }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  const presenter = new SendAppFeedbackPresenter({
    displayFeedbacks: (feedbackList) => {
      if (user) {
        const userFeedbacks = feedbackList.filter(feedback => feedback.accountID === user.uid);
        setFeedbacks(userFeedbacks);
      }
    }
  });

  useEffect(() => {
    presenter.fetchFeedbacks();
  }, []);

  const handleEdit = (feedback) => {
    navigation.navigate('CoachUpdateAppFeedbackPage', { feedbackId: feedback.id });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
