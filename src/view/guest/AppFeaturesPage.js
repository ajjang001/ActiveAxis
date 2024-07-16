import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView } from 'react-native';
import DisplayAppFeaturesPresenter from '../../presenter/DisplayAppFeaturesPresenter';
import { MessageDialog, LoadingDialog } from '../../components/Modal';
import {scale} from '../../components/scale';

const AppFeaturesPage = () => {
  // State to store the features list
  const [features, setFeatures] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalMsg, setModalMsg] = useState('');

  
  // load features
  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      try {
        await new DisplayAppFeaturesPresenter({changeFeatures: setFeatures}).displayAppFeatures();
      } catch (error) {
        changeModalVisible(true, 'Error: ' + error);
      }finally{
        setLoading(false);
      }
    };
    
  
    fetchFeatures();
  }, []);

   // change popup/modal visible
  const changeLoadingVisible = (b)=>{
    setLoading(b);
  }

    // change popup/modal visible
  const changeModalVisible = (b, m)=>{
    setModalMsg(m);
    setIsModalVisible(b);
  }

  // loading dialog
  if (loading) {
    return (
      <Modal transparent={true} animationType='fade' visible={loading} nRequestClose={()=>changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Functions & Features</Text>
      
      {features.map((item, index) => (
        <View key={index} style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{item}</Text>
          </View>
        </View>
      ))}

      <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={()=>changeModalVisible(false)}>
          <MessageDialog
          message = {modalMsg} 
          changeModalVisible = {changeModalVisible} 
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  imageContainer: {
    width: scale(50),
    height: scale(50),
    backgroundColor: '#D3D3D3',
    marginRight: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: scale(40),
    height: scale(40),
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
});

export default AppFeaturesPage;
