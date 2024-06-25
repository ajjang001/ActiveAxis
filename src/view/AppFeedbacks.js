import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import FeedbackCard from '../components/FeedbackCard';
import DisplayAppFeedbacksPresenter from '../presenter/DisplayAppFeedbacksPresenter';

const AppFeedbacks = () => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const presenter = new DisplayAppFeedbacksPresenter({
    displayFeedback: (data) => {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Feedbacks</Text>
      {feedback && (
        <FeedbackCard
          avatar={feedback.profilePicture || feedback.avatar}
          name={feedback.fullName || feedback.name}
          rating={feedback.rating}
          feedback={feedback.feedbackText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#FBF5F3',
    alignItems: 'center',
    justifyContent: 'center',
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

export default AppFeedbacks;
