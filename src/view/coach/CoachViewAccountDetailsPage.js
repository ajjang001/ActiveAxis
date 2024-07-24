import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DisplayAccountDetailsPresenter from '../../presenter/DisplayAccountDetailsPresenter';
import { useRoute, useNavigation } from '@react-navigation/native';

const CoachViewAccountDetailsPage = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Initialize navigation
  const { userEmail, userType } = route.params;

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  // const [password, setPassword] = useState(''); // Typically, password shouldn't be fetched or displayed

  const presenter = new DisplayAccountDetailsPresenter({
    displayAccountDetails: (accountDetails) => {
      console.log("Displaying account details:", accountDetails);
      setName(accountDetails.fullName);
      setPhoneNumber(accountDetails.phoneNumber);
      setEmail(accountDetails.email);
      // Password should not be handled this way due to security reasons
      // setPassword(accountDetails.password);
    }
  });

  useEffect(() => {
    if (userEmail && userType) {
      presenter.viewAccountDetails(userEmail, userType).catch((error) => {
        console.error("Error in presenter:", error.message);
      });
    }
  }, [userEmail, userType]);

  const handleEdit = () => {
    navigation.navigate('CoachEditAccountDetailsPage', { userEmail, userType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={false}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={false}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={false}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>EDIT</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDF4F1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  formContainer: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#C53A45',
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#E28413',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CoachViewAccountDetailsPage;
