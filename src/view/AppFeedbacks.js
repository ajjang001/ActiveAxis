import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import FeedbackCard from '../components/FeedbackCard';

const feedbackData = [
  {
    avatar: require('../../assets/avatar.png'),
    name: 'John Doe',
    rating: 5,
    feedback: 'This is a test 1This This ThisThisThisThisThisThisThis ThisThisThisThisThisThisThisThis This This.\nTest\nTest\nTest\nTest\nTest\nTest\nTest\nTest',
  },
  {
    avatar: require('../../assets/avatar.png'),
    name: 'Jane Smith',
    rating: 4,
    feedback: 'This is a test 2.',
  },
  {
    avatar: require('../../assets/avatar.png'),
    name: 'Alice Johnson',
    rating: 3,
    feedback: 'This is a test 3\nTest\nTest\nTest\nTest\nTest\nTest\nTest\nTest',
  },
];

const AppFeedbacks = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>App Feedbacks</Text>
      {feedbackData.map((item, index) => (
        <FeedbackCard
          key={index}
          avatar={item.avatar}
          name={item.name}
          rating={item.rating}
          feedback={item.feedback}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#FBF5F3',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AppFeedbacks;
