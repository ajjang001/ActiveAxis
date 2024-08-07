import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { scale } from '../../components/scale';
import FitnessGoalsPresenter from '../../presenter/FitnessGoalsPresenter';

const FitnessGoalsPage = ({ navigation }) => {
  const [fitnessGoals, setFitnessGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const presenter = new FitnessGoalsPresenter({
    updateFitnessGoals: (goals) => {
      console.log('Updating fitness goals in view:', goals);  // Debug log
      setFitnessGoals(goals);
    }
  });

  useEffect(() => {
    presenter.loadFitnessGoals();
  }, []);

  const handleAddFitnessGoal = async () => {
    await presenter.addFitnessGoal(newGoal);
    setNewGoal('');
  };

  const handleUpdateFitnessGoal = async (index, text) => {
    await presenter.updateFitnessGoal(index, text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Goals</Text>
      <TextInput
        style={styles.input}
        placeholder="Add new goal"
        value={newGoal}
        onChangeText={setNewGoal}
      />
      <Button title="Add" onPress={handleAddFitnessGoal} />
      <FlatList
        data={fitnessGoals}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <TextInput
              style={styles.listInput}
              value={item.goalName}
              onChangeText={(text) => handleUpdateFitnessGoal(index, text)}
            />
          </View>
        )}
        keyExtractor={(item, index) => item.goalID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    backgroundColor: '#FBF5F3',
  },
  title: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: scale(10),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: scale(10),
    marginBottom: scale(10),
    borderRadius: 5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(10),
  },
  listInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: scale(10),
    borderRadius: 5,
    marginRight: scale(10),
  },
});

export default FitnessGoalsPage;
