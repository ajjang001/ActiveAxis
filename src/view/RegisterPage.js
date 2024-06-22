import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';

const RegisterPage = ({ navigation }) => {

  const genderData = [
    { label: 'Male', value: '1' },
    { label: 'Female', value: '2' },
  ];

  const goalsData = [
    { label: 'Goal 1', value: '1' },
    { label: 'Goal 2', value: '2' },
    { label: 'Goal 3', value: '3' },
  ];

  const levelData = [
    { label: 'Beginner', value: '1' },
    { label: 'Intermediate', value: '2' },
    { label: 'Advanced', value: '3' },
  ];

  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [goal, setGoal] = useState(null);
  const [level, setLevel] = useState(null);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.orange}>
        <View style={styles.container2}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Gender</Text>
            <Dropdown
              style={styles.dropdown}
              data={genderData}
              labelField="label"
              valueField="value"
              placeholder="Choose your gender"
              value={gender}
              onChange={item => {
                setGender(item.value);
                console.log('selected', item);
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              placeholder="Enter your age"
              value={age}
              onChangeText={text => setAge(text)}
              style={styles.input}
              maxLength={2}
              keyboardType="phone-pad"
              returnKeyType='done'
            />
            <Text style={styles.label}>Weight (KG)</Text>
            <TextInput
              placeholder="Enter your weight"
              value={weight}
              onChangeText={text => setWeight(text)}
              style={styles.input}
              maxLength={3}
              keyboardType="phone-pad"
              returnKeyType='done'
            />
            <Text style={styles.label}>Height (CM)</Text>
            <TextInput
              placeholder="Enter your height"
              value={height}
              onChangeText={text => setHeight(text)}
              style={styles.input}
              maxLength={3}
              keyboardType="phone-pad"
              returnKeyType='done'
            />
          </View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Goals</Text>
            <Dropdown
              style={styles.dropdown}
              data={goalsData}
              labelField="label"
              valueField="value"
              placeholder="Choose your goals"
              value={goal}
              onChange={item => {
                setGoal(item.value);
                console.log('selected', item);
              }}
            />
          </View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Level</Text>
            <Dropdown
              style={styles.dropdown}
              data={levelData}
              labelField="label"
              valueField="value"
              placeholder="Choose your level"
              value={level}
              onChange={item => {
                setLevel(item.value);
                console.log('selected', item);
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Register2', { gender, age, weight, height, goal, level })
            console.log({ gender, age, weight, height, goal, level })
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  orange: {
    flex: 0.9,
    backgroundColor: '#E28413',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 40,
  },
  container2: {
    backgroundColor: '#E6E6E6',
    width: '90%',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 25,
    borderColor: '#C42847',
    borderWidth: 3,
  },
  label: {
    paddingLeft: 5,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '95%',
  },
  dropdownContainer: {
    width: '95%',
  },
  dropdown: {
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    paddingHorizontal: 15,
    paddingVertical: 0,
    borderRadius: 10,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  button: {
    backgroundColor: 'black',
    width: '75%',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',

  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
})