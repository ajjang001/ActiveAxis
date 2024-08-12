import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const weeks = [
  { id: '1', week: 'Week 1' },
  { id: '2', week: 'Week 2' },
  { id: '3', week: 'Week 3' },
  { id: '4', week: 'Week 4' },
];

const days = [
  { id: '1', day: 'Day 1', calories: '0 Cal' },
  { id: '2', day: 'Day 2', calories: '0 Cal' },
  { id: '3', day: 'Day 3', calories: '0 Cal' },
  { id: '4', day: 'Day 4', calories: '0 Cal' },
  { id: '5', day: 'Day 5', calories: '0 Cal' },
  { id: '6', day: 'Day 6', calories: '0 Cal' },
  { id: '7', day: 'Day 7', calories: '0 Cal' },
];

const UserFitnessPlanListPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>June 2024</Text>
      <View style={styles.weeksContainer}>
        {weeks.map((week) => (
          <TouchableOpacity key={week.id} style={styles.weekButton}>
            <Text style={styles.weekText}>{week.week}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={days}
        renderItem={({ item }) => (
          <View style={styles.dayContainer}>
            <Text style={styles.dayText}>{item.day}</Text>
            <Text style={styles.caloriesText}>{item.calories}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.daysList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A42C26',
    textAlign: 'center',
    marginBottom: 16,
  },
  weeksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F2A100',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  weekText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  daysList: {
    justifyContent: 'space-between',
  },
  dayContainer: {
    flex: 1,
    padding: 20,
    margin: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A42C26',
  },
  caloriesText: {
    fontSize: 14,
    color: '#888',
  },
});

export default UserFitnessPlanListPage;
