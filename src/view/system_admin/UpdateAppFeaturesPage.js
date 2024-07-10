import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import UpdateAppFeaturesPresenter from '../../presenter/UpdateAppFeaturesPresenter';
import { MessageDialog, LoadingDialog } from '../../components/Modal';
import { scale } from '../../components/scale';

const UpdateAppFeaturesPage = () => {
  // state variables
  const [features, setFeatures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalMsg, setModalMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // load features
  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      try {
        await new UpdateAppFeaturesPresenter({changeFeatures: setFeatures}).displayAppFeatures();
      } catch (error) {
        changeModalVisible(true, 'Error: ' + error);
      }finally{
        setLoading(false);
      }
    };
    
    fetchFeatures();
  }, []);

  // handle feature change
  const handleFeatureChange = (text, index) => {
    const newFeatures = [...features];
    newFeatures[index] = text;
    setFeatures(newFeatures);
  };

  // handle edit
  const handleEdit = () => {
    setIsEditing(true);
  };

  // handle save
  const handleSave = async () => {
    setLoading(true);
    try {
      await new UpdateAppFeaturesPresenter().updateAppFeatures(features);
      changeModalVisible(true, 'Features saved successfully!');
    } catch (error) {
      changeModalVisible(true, 'Error: ' + error);
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  // change popup/modal visible
  const changeLoadingVisible = (b) => {
    setLoading(b);
  };

  // change popup/modal visible
  const changeModalVisible = (b, m) => {
    setModalMsg(m);
    setIsModalVisible(b);
  };

  // render loading dialog
  if (loading) {
    return (
      <Modal transparent={true} animationType='fade' visible={loading} onRequestClose={() => changeLoadingVisible(false)}>
        <LoadingDialog />
      </Modal>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <TouchableOpacity onPress={isEditing ? handleSave : handleEdit} style={styles.button}>
    <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Functions & Features</Text>
      
      {features.map((item, index) => (
        <View key={index} style={styles.row}>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              value={item}
              onChangeText={(text) => handleFeatureChange(text, index)}
            />
          ) : (
            <View style={styles.textContainer}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        </View>
      ))}
      <Modal transparent={true} animationType='fade' visible={isModalVisible} onRequestClose={() => changeModalVisible(false)}>
        <MessageDialog
          message={modalMsg} 
          changeModalVisible={changeModalVisible} 
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: scale(20),
    backgroundColor: '#FBF5F3',
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: scale(20),
    textAlign: 'center',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  textInput: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    padding: scale(10),
    marginLeft: scale(20),
    marginRight: scale(20),
  },
  textContainer: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    padding: scale(10),
    marginLeft: scale(20),
    marginRight: scale(20),
  },
  text: {
    fontSize: scale(15),
    marginLeft: scale(20),
    fontFamily: 'Inter',
  },
  button: {
    backgroundColor: '#C42847',
    padding: scale(10),
    borderRadius: 5,
    marginTop: scale(20),
    alignSelf: 'flex-end',
},
  buttonText: {
    color: '#FFF',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
});

export default UpdateAppFeaturesPage;
