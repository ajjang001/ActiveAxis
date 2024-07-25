import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, TouchableOpacity, Modal } from 'react-native';
import { scale} from '../../components/scale';
import FeedbackCard from '../../components/FeedbackCard';
import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';

import SendAppFeedbackPresenter from '../../presenter/SendAppFeedbackPresenter';

const CoachAppFeedbackPage = ({ navigation, route }) => {
  const [feedback, setFeedback] = useState([]);
  const {coach} = route.params;

  
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
  const loadFeedback = async() => {
    try{
      changeLoadingVisible(true);
      setFeedback([]);
      await new SendAppFeedbackPresenter({displayFeedback: setFeedback}).fetchFeedback(coach.accountID);
    }catch (e){
      changeModalVisible(true, e.message);
    }finally{
      changeLoadingVisible(false);
    }
  }
  const handleEdit = (feedback) => {
      navigation.navigate('CoachUpdateAppFeedbackPage', { feedback, coach });
  };


  useEffect(() => {
      loadFeedback();
  }, []);

  useEffect(() => {
      if(route.params?.refresh){
          
          loadFeedback();
          route.params.refresh = false;
      }
  }, [route.params?.refresh]);



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
          <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
      </Modal>

        <FeedbackCard
          avatar={feedback.profilePicture}
          name={feedback.fullName}
          rating={feedback.rating}
          feedback={feedback.feedbackText}
        />

      <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(feedback)}>
            <Text style={styles.editButtonText}>EDIT</Text>
          </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: scale(20),
    paddingHorizontal: scale(10),
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#DA872A',
    borderRadius: 10,
    paddingVertical: scale(10),
    paddingHorizontal: scale(30),
    marginTop: scale(10),
    alignSelf: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
});

export default CoachAppFeedbackPage;
