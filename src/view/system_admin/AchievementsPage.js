import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import { scale } from '../../components/scale';
import { LoadingDialog, MessageDialog, ActionDialog } from "../../components/Modal";
import DisplayListOfAchievementsPresenter from '../../presenter/DisplayListOfAchievementsPresenter';



const AchievementsPage = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const [allAchievements, setAllAchievements] = useState([]);

  // change popup/modal visible
  const changeModalVisible = (b, m)=>{
    setModalMsg(m);
    setModalVisible(b);
}

// change popup/modal visible
const changeLoadingVisible = (b)=>{
    setIsLoading(b);
}

  const renderHeader = () => (
    <TouchableOpacity style={styles.createButton} onPress={() => { navigation.navigate('CreateAchievementsPage') }}>
      <Text style={styles.createButtonText}>Create</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionHeader}>{section.type}</Text>
  );

  const loadSectionContent = (category) =>{
    return(
      category.data.map((item) => {
      
        return (
          <TouchableOpacity onPress = {()=>{navigation.navigate('AchievementDetailsPage', {achievementID: item.achievementID})}} style={styles.achievementBox} key = {item.achievementID}>
            {item.achievementPicture ? (
              <Image source={{uri:item.achievementPicture}} style={styles.icon} />
            ) : (
              <View style={styles.blankIcon} />
            )}
            <Text style={styles.achievementText}>{item.achievementName}</Text>
          </TouchableOpacity>
        );
      })
    );
  };

  const renderSection = () => (
    <>
      {allAchievements.map((category) => {
        
          return (
            <View style={styles.section} key = {category.type}>
              {renderSectionHeader({ section: category })}

              <View style = {styles.sectionContent}>
                {loadSectionContent(category)}
              </View>
            </View>
          );
          
        })}
    </>
  );

  const loadAchievements = async () => {
    try{
      changeLoadingVisible(true);
      setAllAchievements([]);
      await new DisplayListOfAchievementsPresenter({displayAchievements:setAllAchievements}).getAchievements();
    }catch(e){
      changeModalVisible(true, e.message);
    }finally{
      changeLoadingVisible(false);
    }
  };

  useEffect(()=>{
    if (route.params?.refresh){
        loadAchievements();
        route.params.refresh = false;
    }
  },[route.params?.refresh]);

  useEffect(() => {
    loadAchievements();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
      {renderHeader()}
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={()=>changeLoadingVisible(false)}>
          <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={()=>changeModalVisible(false)}>
          <MessageDialog message = {modalMsg} changeModalVisible = {changeModalVisible} />
      </Modal>
      {renderSection({ item: allAchievements })}
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF5F3',
  },
  createButton: {
    backgroundColor: '#E28413',
    padding: scale(10),
    borderRadius: 5,
    marginTop: scale(20),
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#FBF5F3',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  sectionListContainer: {
    paddingHorizontal: 10,
  },
  sectionContent: {
    display:'flex', 
    flexDirection:'row', 
    flexWrap:'wrap',
  },
  achievementBox: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
    backgroundColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  blankIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
    backgroundColor: '#EEE',
  },
  achievementText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});

export default AchievementsPage;