import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView } from 'react-native';
import DisplayAppFeaturesPresenter from '../presenter/DisplayAppFeaturesPresenter';
import { MessageDialog, LoadingDialog } from '../components/Modal';

const AppFeaturesPage = () => {
  const [features, setFeatures] = useState([]);

  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalMsg, setModalMsg] = useState('');

  
  
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
    padding: 20,
    backgroundColor: '#FBF5F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#D3D3D3',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    fontSize: 15,
    marginLeft: 20,
    fontFamily: 'Inter',
  },
});

export default AppFeaturesPage;
