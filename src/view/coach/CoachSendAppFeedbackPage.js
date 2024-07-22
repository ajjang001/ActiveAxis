import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CoachSendAppFeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

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

  const handleSubmit = () => {
    // Handle the submit action (e.g., send feedback to the server)
    console.log('Rating:', rating);
    console.log('Feedback:', feedback);
  };

  return (
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
