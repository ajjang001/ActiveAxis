import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { scale } from '../../components/scale';
import FitnessGoalsPresenter from '../../presenter/FitnessGoalsPresenter';
import { useFocusEffect } from '@react-navigation/native';

const FitnessGoalsPage = ({ navigation }) => {
  const [fitnessGoals, setFitnessGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [tempUpdate, setTempUpdate] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const presenter = new FitnessGoalsPresenter({
    updateFitnessGoals: (goals) => {
      console.log('Updating fitness goals in view:', goals);  // Debug log
      setFitnessGoals(goals);
    }
  });


  useFocusEffect(
    useCallback(()=>{
        setFitnessGoals([]);
        presenter.loadFitnessGoals();
    },[])
);

  const handleAddFitnessGoal = async () => {
    if (newGoal.trim() === '') {
      alert('Please enter a valid fitness goal.');
      return;
  }
    await presenter.addFitnessGoal(newGoal, fitnessGoals);
    setFitnessGoals([]);
    presenter.loadFitnessGoals();
    setNewGoal('');
  };

  const handleUpdateFitnessGoal = async (index) => {
    if(tempUpdate.trim()===''){
      alert('Please enter a non-empty fitness goal to update');
      return;
  }
    await presenter.updateFitnessGoal(index, tempUpdate, fitnessGoals);
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
      <TouchableOpacity style={styles.addButton} onPress={handleAddFitnessGoal}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <FlatList
        data={fitnessGoals}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <TextInput
              style={styles.listInput}
              value={editingIndex === index ? tempUpdate : item.goalName}
              onChangeText={(text)=>{
                setEditingIndex(index);
                setTempUpdate(text);
                console.log(text);
              }}
              onEndEditing={(text) => handleUpdateFitnessGoal(index)}
              
            />
          </View>
        )}
        keyExtractor={(item) => item.goalID}
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
  addButton: {
    backgroundColor: 'orange',
    padding: scale(10),
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: scale(20),
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
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

