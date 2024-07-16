import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckBox } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';


import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';

import RegisterPresenter from '../../presenter/RegisterPresenter';
import { scale } from '../../components/scale';

const RegisterPage = ({ navigation }) => {

  // Dropdown Data
  const genderData = [
    { label: 'Male', value: 'm' },
    { label: 'Female', value: 'f' },
  ];
  const goalsData = [
    { label: 'Goal 1', value: 'Goal 1' },
    { label: 'Goal 2', value: 'Goal 2' },
    { label: 'Goal 3', value: 'Goal 3' },
  ];
  const levelData = [
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
  ];
  
  // Modal/Display Message
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // Date Picker
  const [open, setOpen] = useState(false)

  // User Info
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [medicalCheck, setmedicalCheck] = useState(false);

  // change popup/modal visible
  const changeModalVisible = (b, m)=>{
      setModalMsg(m);
      setIsModalVisible(b);
  }

  // Date formatter
  const formatDate = (date) => {
    if (!date) return "";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

  const processProfiling = async (gender, dob, weight, height, goal, level, medicalCheck) => {
    try {
        // Call the presenter to process the profiling
        await new RegisterPresenter().processProfiling(gender, dob ? dob.toISOString() : null, weight, height, goal, level, medicalCheck);

        // Navigate to the next screen
        navigation.navigate('Register2', { gender, dob : dob ? dob.toISOString() : null, weight, height, goal, level, medicalCheck });
    } catch (e) {
      // Show error message
      changeModalVisible(true, e.message);
    }
  }

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
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setOpen(true)}>
                <View style = {styles.input}>
                    <Text>{dob ? formatDate(dob) : "Enter your date of birth"}</Text>
                </View>
            </TouchableOpacity>

            <DatePicker 
                modal 
                open = {open}
                date = {dob || new Date()}
                mode = 'date'
                minimumDate={new Date(1900, 0, 1)}
                maximumDate={new Date()}
                onConfirm = {(date) =>{
                    setOpen(false);
                    setDob(date);
                }}
                onCancel ={() => {
                    setOpen(false);
                }}
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
              }}
            />
          </View>
          <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={()=>changeModalVisible(false)}>
              <MessageDialog
              message = {modalMsg} 
              changeModalVisible = {changeModalVisible} 
              />
          </Modal>

          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={medicalCheck}
              onPress={() => setmedicalCheck(!medicalCheck)}
              title={
                <Text style={{ marginLeft: 10, maxWidth:'80%' }}>
                  I have a medical condition that might affect my ability to exercise.
                </Text>}
              iconType="material-community"
              checkedIcon="checkbox-outline"
              uncheckedIcon={'checkbox-blank-outline'}
              checkedColor="black"
              textStyle=''
              containerStyle={{ backgroundColor: 'transparent' }}
            />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            //processProfiling(gender, age, weight, height, goal, level, medicalCheck)
            processProfiling(gender, dob, weight, height, goal, level, medicalCheck)
          }
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
    backgroundColor: '#E28413',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: scale(40),
    paddingBottom: scale(70),
  },
  container2: {
    backgroundColor: '#E6E6E6',
    width: '90%',
    alignItems: 'center',
    borderRadius: scale(25),
    marginTop: scale(20),
    paddingTop: scale(10),
    paddingBottom: scale(25),
    borderColor: '#C42847',
    borderWidth: 3,
  },
  label: {
    paddingLeft: scale(5),
    marginTop: scale(10),
    marginBottom: scale(5),
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
    paddingHorizontal: scale(15),
    paddingVertical: scale(0),
    borderRadius: scale(10),
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderRadius: 10,
  },
  buttonContainer: {
    width: '70%',
    alignItems: 'center',
    marginTop: scale(40),
  },
  button: {
    backgroundColor: 'black',
    width: '75%',
    padding: scale(10),
    borderRadius: 25,
    alignItems: 'center',

  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(18),
  },
  checkboxContainer: {
    width: '100%',
    marginTop: scale(10),

  },
})