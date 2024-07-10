import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { scale } from '../../components/scale';

const SystemAdminAppDetails= ({ navigation }) => {
  // handle button press
  const handlePress = (label) => {
    // navigate to the selected page
    if (label === 'About ActiveAxis') {
      navigation.navigate('UpdateAboutUsPage');
    }
    if (label === 'Functions & Features'){
      navigation.navigate('UpdateAppFeaturesPage');
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
      
    </ScrollView>
  );
};

/*
RGBA: Red Green Blue Alpha
#BA0000 (Red) to rgba(186, 0, 0, 0.2).
#0075FF (Blue) to rgba(0, 117, 255, 0.2).
0.2 -> Decrease opacity to 20%.
*/

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