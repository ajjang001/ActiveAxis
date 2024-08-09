import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { scale } from '../../components/scale';
import { LoadingDialog, MessageDialog } from "../../components/Modal";
import DisplayAchievementPresenter from '../../presenter/DisplayAchievementPresenter';

const AchievementItem = ({ achievement, obtained, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => obtained && onPress(achievement)}
      style={[styles.achievementItem, obtained ? styles.completedAchievement : styles.lockedAchievement]}
    >
      <View style={styles.achievementText}>
        <Text style={styles.achievementName}>{achievement._achievementName}</Text>
        <Image
          source={{ uri: achievement._achievementPicture }}
          style={styles.achievementIcon}
        />
        <Text style={styles.achievementDescription}>{achievement._description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const UserAchievementPage = ({ navigation, route }) => {

  const { user } = route.params;
  userID = user.accountID;

  const [achievements, setAchievements] = useState([]);
  const [obtainedAchievements, setObtainedAchievements] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // change popup/modal visible
  const changeModalVisible = (b, m) => {
    setModalMsg(m);
    setModalVisible(b);
  }

  // change popup/modal visible
  const changeLoadingVisible = (b) => {
    setIsLoading(b);
  }

  const fetchAchievements = async () => {
    try {
      setIsLoading(true);
      const presenter = new DisplayAchievementPresenter();
      await presenter.fetchUserAchievements(userID, setAchievements, setObtainedAchievements);
    } catch (error) {
      setModalVisible(true);
      setModalMsg(error.message);
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [userID]);

  const completedAchievements = useMemo(
    () => obtainedAchievements.map(obt => {
      const achievement = achievements.find(ach => ach._achievementID === obt._achievementID);
      return { ...achievement, dateAchieved: obt.dateAchieved };
    }),
    [achievements, obtainedAchievements]
  );

  const lockedAchievements = useMemo(
    () => achievements.filter(ach => !obtainedAchievements.some(obt => obt._achievementID === ach._achievementID)),
    [achievements, obtainedAchievements]
  ); 

  const handlePressAchievement = (achievement) => {
    navigation.navigate('UserShareAchievementPage', { achievement });
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Achievements</Text>
      </View>
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
        <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
        <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
      </Modal>
      <ScrollView contentContainerStyle={{alignItems:'center'}}>
        <Text style={styles.subHeaderText}>Unlocked</Text>
        {completedAchievements.length === 0 && !isLoading ? (
          <Text style={styles.noachievementText}>No Achievements Unlocked</Text>
        ) : (
          // <FlatList
          //   data={completedAchievements}
          //   keyExtractor={(item) => item._achievementID}
          //   renderItem={({ item }) => <AchievementItem achievement={item} obtained={true} onPress={handlePressAchievement} />}
          //   contentContainerStyle={styles.listContainer}
          //   numColumns={2}
          //   style={[
          //     styles.flatList,
          //     completedAchievements.length <= 2 ? { minHeight: '20%' } : { maxHeight: '60%' },
          //   ]}
          // />
          <View style = {{flexDirection:'row', flexWrap:'wrap',}}>
            {
              completedAchievements.map((item, index) => (
                <AchievementItem key={index} achievement={item} obtained={true} onPress={handlePressAchievement} />
              ))
            }
          </View>
          
          )}
        <Text style={styles.subHeaderText}>Locked</Text>
        {/* <FlatList
          data={lockedAchievements}
          keyExtractor={(item) => item._achievementID}
          renderItem={({ item }) => <AchievementItem achievement={item} obtained={false} />}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          style={[
            styles.flatList,
            completedAchievements.length <= 2 ? { minHeight: '20%' } : { maxHeight: '60%' },
          ]}
        /> */}
        <View style = {{flexDirection:'row', flexWrap:'wrap'}}>
            {
              lockedAchievements.map((item, index) => (
                <AchievementItem key={index} achievement={item} obtained={false} />
              ))
            }
          </View>
      </ScrollView>
    </View>


  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FBF5F3',
    
  },
  headerContainer: {
    width: '90%',
  },
  headerText: {
    fontSize: scale(36),
    fontFamily: 'League-Spartan',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: scale(20),
    fontFamily: 'League-Spartan',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: scale(5),
  },
  listContainer: {
    paddingBottom: scale(10),
    justifyContent: 'center',
  },
  flatList: {
    flexGrow: 1,
    width: '90%',
  },
  achievementItem: {
    width: '45%',
    margin: scale(10),
    padding: scale(10),
    borderRadius: scale(15),
    alignItems: 'center',
    justifyContent: 'center'
  },
  completedAchievement: {
    backgroundColor: '#d4edda',
  },
  lockedAchievement: {
    backgroundColor: '#f8d7da',
  },
  achievementIcon: {
    width: scale(80),
    height: scale(80),
    marginVertical: scale(5),
    borderRadius: scale(100),
    backgroundColor: 'white',
  },
  achievementText: {
    alignItems: 'center'
  },
  achievementName: {
    fontSize: scale(18),
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center'
  },
  achievementDescription: {
    fontSize: scale(14),
    color: '#555',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  noachievementText: {
    fontFamily: 'Inter',
    fontSize: scale(18),
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginBottom: scale(20)
  }
});


export default UserAchievementPage;