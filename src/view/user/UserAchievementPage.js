import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Modal } from 'react-native';
import { scale } from '../../components/scale';
import DisplayAchievementPresenter from '../../presenter/DisplayAchievementPresenter';

const AchievementItem = ({ achievement, obtained }) => {
  return (
    <View style={[styles.achievementItem, obtained ? styles.completedAchievement : styles.lockedAchievement]}>
      <View style={styles.achievementText}>
        <Text style={styles.achievementName}>{achievement.achievementName}</Text>
        <Image
          source={{ uri: achievement.achievementPicture }}
          style={styles.achievementIcon}
        />
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
      </View>
    </View>
  );
};

const UserAchievementPage = ({ navigation, route }) => {

  const { user } = route.params;
  userID = user.accountID;

  const [achievements, setAchievements] = useState([]);
  const [obtainedAchievements, setObtainedAchievements] = useState([]);

  const fetchAchievements = async () => {
    try {
      const presenter = new DisplayAchievementPresenter();
      await presenter.fetchUserAchievements(userID, setAchievements, setObtainedAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {

    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [userID]);

  const completedAchievements = achievements.filter(ach => obtainedAchievements.some(obt => obt._achievementID === ach._achievementID));
  const lockedAchievements = achievements.filter(ach => !obtainedAchievements.some(obt => obt._achievementID === ach._achievementID));
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Achievements</Text>
      </View>
      <Text style={styles.subHeaderText}>Unlocked Achievements</Text>
      <FlatList
        data={completedAchievements}
        keyExtractor={(item) => item.achievementID}
        renderItem={({ item }) => <AchievementItem achievement={item} obtained={true} />}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        style={styles.flatList}
      />
      <Text style={styles.subHeaderText}>Locked Achievements</Text>
      <FlatList
        data={lockedAchievements}
        keyExtractor={(item) => item.achievementID}
        renderItem={({ item }) => <AchievementItem achievement={item} obtained={false} />}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        style={styles.flatList}
      />
    </View>


  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    width: '90%',
  },
  headerText: {
    fontSize: scale(36),
    fontFamily: 'League-Spartan',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: scale(5),
  },
  subHeaderText: {
    fontSize: scale(20),
    fontFamily: 'League-Spartan',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: scale(5),
  },
  listContainer: {
    paddingBottom: scale(20),
  },
  flatList: {
    flex: 1,
    width: '90%',
  },
  achievementItem: {
    width: '45%',
    margin: scale(10),
    padding: scale(10),
    borderRadius: scale(15),
    alignItems: 'center',
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
    fontWeight: 'bold',
    textAlign: 'center'
  },
  achievementDescription: {
    fontSize: scale(14),
    color: '#555',
    textAlign: 'center',
  },
});


export default UserAchievementPage;