import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const CreateAchievementsPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Achievement</Text>
      <View style={styles.imagePlaceholder} />
      <Text style={styles.detailsTitle}>Achievement Details:</Text>
      <TextInput
        style={styles.detailsInput}
        placeholder="Enter details here..."
        multiline
      />
      <TouchableOpacity style={styles.postButton} onPress={() => { /* Handle post action */ }}>
        <Text style={styles.postButtonText}>POST</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#D3D3D3',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsTitle: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsInput: {
    width: '100%',
    height: 100,
    backgroundColor: '#FFF',
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  postButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#B22222',
    borderRadius: 5,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateAchievementsPage;
