import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';

const EditAchievementsPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Achievements</Text>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/people-icon.png')} style={styles.image} />
        <TouchableOpacity style={styles.deleteButton} onPress={() => { }}>
          <Image source={require('../../assets/delete-icon.png')} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.detailsTitle}>Achievement Details:</Text>
      <TextInput
        style={styles.detailsInput}
        placeholder="Enter details here..."
        multiline
        defaultValue=""
      />
      <TouchableOpacity style={styles.editButton} onPress={() => { }}>
        <Text style={styles.editButtonText}>Edit</Text>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 5,
  },
  deleteIcon: {
    width: 24,
    height: 24,
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
  editButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#FFA500',
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditAchievementsPage;
