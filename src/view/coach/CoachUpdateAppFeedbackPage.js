import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import UpdateAppFeedbackPresenter from '../../presenter/UpdateAppFeedbackPresenter';

const CoachUpdateAppFeedbackPage = ({ route, navigation }) => {
  const { feedbackId } = route.params;
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const presenter = new UpdateAppFeedbackPresenter({
    onFeedbackUpdated: () => {
      alert('Feedback updated successfully');
      navigation.goBack();
    }
  });

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const feedbackDoc = await getDoc(doc(db, 'appfeedback', feedbackId));
        if (feedbackDoc.exists()) {
          const feedbackData = feedbackDoc.data();
          setRating(feedbackData.rating);
          setFeedbackText(feedbackData.feedbackText);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedbackDetails();
  }, [feedbackId]);

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
    setModalVisible(true);
  };

  const handleSave = () => {
    setModalVisible(false);
    presenter.updateFeedback(feedbackId, { feedbackText, rating });
  };

  const handleCancel = () => {
    setModalVisible(false);
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
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>SAVE</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Do you want to save changes?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CoachUpdateAppFeedbackPage;
