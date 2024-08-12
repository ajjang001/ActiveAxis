import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from '../../components/scale';

const AboutOurApp = ({ navigation }) => {
  // Function to handle button press
  const handlePress = (label) => {
    if (label === 'About ActiveAxis') {
      navigation.navigate('AboutActiveAxisPage');
    }
    if (label === 'Functions & Features'){
      navigation.navigate('AppFeaturesPage');
    }
    if (label === 'App Feedbacks'){
      navigation.navigate('AppFeedBackPage')
    }
    if (label === 'User Statistics'){
      navigation.navigate('UserStatisticsPage')
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle ={{alignItems:'center'}}>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'rgba(186, 0, 0, 0.2)' }]} onPress={() => handlePress('About ActiveAxis')}>
          <Text style={styles.buttonText}>About ActiveAxis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'rgba(0, 117, 255, 0.2)' }]} onPress={() => handlePress('Functions & Features')}>
          <Text style={styles.buttonText}>Functions & Features</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'rgba(29, 112, 0, 0.2)' }]} onPress={() => handlePress('App Feedbacks')}>
          <Text style={styles.buttonText}>App Feedbacks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'rgba(226, 132, 19, 0.2)' }]} onPress={() => handlePress('User Statistics')}>
          <Text style={styles.buttonText}>User Statistics</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF5F3',
    padding: scale(10),
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

export default AboutOurApp;