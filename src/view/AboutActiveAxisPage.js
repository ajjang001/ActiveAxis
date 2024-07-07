import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import DisplayAboutActiveAxisPresenter from '../presenter/DisplayAboutActiveAxisPresenter';

import { ActionDialog, LoadingDialog, MessageDialog } from '../components/Modal';

const AboutActiveAxisPage = () => {
  const [about, setAbout] = useState([]);
  const [logoURL, setLogoURL] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
    
  // change popup/modal visible
  const changeLoadingVisible = (b)=>{
      setIsLoading(b);
  }
  
  // change popup/modal visible
  const changeModalVisible = (b, m)=>{
    setModalMsg(m);
    setModalVisible(b);
  }

  // load data
  const loadData = async () => {
    try{
      changeLoadingVisible(true);
      await new DisplayAboutActiveAxisPresenter({changeAbout: setAbout}).displayAboutActiveAxis();
      await new DisplayAboutActiveAxisPresenter({changeLogoURL: setLogoURL}).displayLogoURL();
    }catch(error){
        changeModalVisible(true, error.message);
    }finally{
        changeLoadingVisible(false);
    }
    
  }

  // load data
  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About ActiveAxis</Text>
      {logoURL ? <Image source={{ uri: logoURL }} style={styles.logo} /> : <ActivityIndicator style = {styles.logo} size = 'large' />}
      <View style={styles.divider} />
      {about.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>{paragraph.trim()}</Text>
      ))}

      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
          <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: -20,
    backgroundColor: '#FBF5F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  divider: {
    width: '90%',
    height: 5,
    backgroundColor: '#C42847',
    marginVertical: 20,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 10,
  },
});

export default AboutActiveAxisPage;
