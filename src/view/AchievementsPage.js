import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SectionList, Image } from 'react-native';
import { scale } from '../components/scale';

const allAchievements = [
  {
    title: 'Competitions Won',
    data: [
      { id: '1', type: 'First Run', icon: require('../../assets/people-icon.png') },
      { id: '2', type: 'Empty' },
      { id: '3', type: 'Empty' },
      { id: '4', type: 'Empty' },
      { id: '10', type: 'Empty' },
      // Add more achievements for the Won category
    ],
  },
  {
    title: 'Running',
    data: [
      { id: '5', type: 'Empty' },
      { id: '6', type: 'Empty' },
      // Add more achievements for the Running category
    ],
  },
  {
    title: 'Steps',
    data: [
      { id: '7', type: 'Empty' },
      { id: '8', type: 'Empty' },
      { id: '9', type: 'Empty' },
      // Add more achievements for the Steps category
    ],
  },
];

const AchievementsPage = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.achievementBox}>
      {item.icon ? (
        <Image source={item.icon} style={styles.icon} />
      ) : (
        <View style={styles.blankIcon} />
      )}
      <Text style={styles.achievementText}>{item.type}</Text>
    </View>
  );

  const renderHeader = () => (
    <TouchableOpacity style={styles.createButton} onPress={() => { /* Navigate to Create screen */ }}>
      <Text style={styles.createButtonText}>Create</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <SectionList
        sections={allAchievements}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => renderSectionHeader({ section })}
        renderItem={({ item }) => renderItem({ item })}
        contentContainerStyle={styles.sectionListContainer}
      />
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
    justifyContent: 'space-between',
  },
  section: {
    marginBottom: 20,
  },
  achievementBox: {
    width: '30%',
    aspectRatio: 1,
    margin: 5,
    backgroundColor: '#FFF',
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
  },
});

export default AchievementsPage;