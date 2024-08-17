import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { scale } from '../../components/scale';
import CompetitionTypePresenter from '../../presenter/CompetitionTypePresenter';
import { useFocusEffect } from '@react-navigation/native';


const CompetitionTypePage = ({ navigation }) => {
  const [competitionTypes, setCompetitionTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const [tempUpdate, setTempUpdate] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const presenter = new CompetitionTypePresenter({
    updateCompetitionTypes: (types) => {
      console.log('Updating competition types in view:', types);  // Debug log
      setCompetitionTypes(types);
    }
  });


  useFocusEffect(
    useCallback(()=>{
        setCompetitionTypes([]);
        presenter.loadCompetitionTypes();
    },[])
);

  const handleAddCompetitionType = async () => {
    if (newType.trim() === '') {
      alert('Please enter a valid competition type.');
      return;
    }
    await presenter.addCompetitionType(newType, competitionTypes);
    setCompetitionTypes([]);
    presenter.loadCompetitionTypes();
    setNewType('');
  };

  const handleUpdateCompetitionType = async (index) => {
    if(tempUpdate.trim()===''){
      alert('Please enter a non-empty competition type to update');
      return;
  }
    await presenter.updateCompetitionType(index, tempUpdate, competitionTypes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Competition Types</Text>
      <TextInput
        style={styles.input}
        placeholder="Add new type"
        value={newType}
        onChangeText={(text)=>setNewType(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddCompetitionType}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <FlatList
        data={competitionTypes}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <TextInput
              style={styles.listInput}
              value={editingIndex === index ? tempUpdate : item.competitionTypeName}
              onChangeText={(text)=>{
                setEditingIndex(index);
                setTempUpdate(text);
                console.log(text);
            }}
            onEndEditing={() => handleUpdateCompetitionType(index)}
              
            />
          </View>
        )}
        keyExtractor={(item) => item.competitionTypeID}
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

export default CompetitionTypePage;

