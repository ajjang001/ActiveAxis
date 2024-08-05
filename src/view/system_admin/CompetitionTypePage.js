import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { scale } from '../../components/scale';
import CompetitionTypePresenter from '../../presenter/CompetitionTypePresenter';

const CompetitionTypePage = ({ navigation }) => {
  const [competitionTypes, setCompetitionTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const presenter = new CompetitionTypePresenter({
    updateCompetitionTypes: (types) => {
      console.log('Updating competition types in view:', types);  // Debug log
      setCompetitionTypes(types);
    }
  });

  useEffect(() => {
    presenter.loadCompetitionTypes();
  }, []);

  const handleAddCompetitionType = async () => {
    if (newType.trim() === '') {
      alert('Please enter a valid competition type.');
      return;
    }
    await presenter.addCompetitionType(newType);
    setNewType('');
  };

  const handleUpdateCompetitionType = async (index, text) => {
    await presenter.updateCompetitionType(index, text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Competition Types</Text>
      <TextInput
        style={styles.input}
        placeholder="Add new type"
        value={newType}
        onChangeText={setNewType}
      />
      <Button title="Add" onPress={handleAddCompetitionType} />
      <FlatList
        data={competitionTypes}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <TextInput
              style={styles.listInput}
              value={item.competitionTypeName}
              onChangeText={(text) => handleUpdateCompetitionType(index, text)}
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
