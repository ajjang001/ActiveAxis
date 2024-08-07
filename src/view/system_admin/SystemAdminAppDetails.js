import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from '../../components/scale';

const SystemAdminAppDetails = ({ navigation }) => {
  const handlePress = (label) => {
    switch (label) {
      case 'About ActiveAxis':
        navigation.navigate('UpdateAboutUsPage');
        break;
      case 'Functions & Features':
        navigation.navigate('UpdateAppFeaturesPage');
        break;
      case 'Competition Type':
        navigation.navigate('CompetitionTypePage');
        break;
      case 'Fitness Goals':
        navigation.navigate('FitnessGoalsPage');
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'rgba(186, 0, 0, 0.2)' }]} onPress={() => handlePress('About ActiveAxis')}>
        <Text style={styles.buttonText}>About ActiveAxis</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'rgba(0, 117, 255, 0.2)' }]} onPress={() => handlePress('Functions & Features')}>
        <Text style={styles.buttonText}>Functions & Features</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'rgba(0, 255, 0, 0.2)' }]} onPress={() => handlePress('Competition Type')}>
        <Text style={styles.buttonText}>Competition Type</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'rgba(255, 165, 0, 0.2)' }]} onPress={() => handlePress('Fitness Goals')}>
        <Text style={styles.buttonText}>Fitness Goals</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBF5F3', // Background color of the entire view
    padding: scale(10),
    paddingBottom: scale(75),
  },
  button: {
    width: '90%',
    padding: scale(20),
    paddingVertical: scale(70),
    marginVertical: scale(10),
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: scale(20),
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default SystemAdminAppDetails;
