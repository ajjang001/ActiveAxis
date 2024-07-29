import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import { CheckBox } from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import { TimerPickerModal } from "react-native-timer-picker";

import { LoadingDialog, MessageDialog } from "../../components/Modal";

import RegisterPresenter from '../../presenter/RegisterPresenter';
import { scale } from '../../components/scale';

const RegisterPage = ({ navigation }) => {

  // Dropdown Data
  const genderData = [
    { label: 'Male', value: 'm' },
    { label: 'Female', value: 'f' },
  ];
  const [goalsData, setGoalsData] = useState([]);
  const [levelData, setLevelData] = useState([]);

  // Modal/Display Message
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // Date Picker
  const [open, setOpen] = useState(false)

  // Rest Interval Setter
  const [showPicker, setShowPicker] = useState(false);
  const [alarmString, setAlarmString] = useState('');
  const [intervalInSeconds, setIntervalInSeconds] = useState(null);

  const handleRestConfirm = (pickedDuration) => {
    const { hours, minutes, seconds } = pickedDuration;
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    if (totalSeconds > 120) {
      totalSeconds = 120;
    }
    setIntervalInSeconds(totalSeconds);
    setAlarmString(totalSeconds);
    setShowPicker(false);
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

  // User Info
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState(null);
  const [level, setLevel] = useState(null);
  const [medicalCheck, setmedicalCheck] = useState(false);

  // change popup/modal visible
  const changeModalVisible = (b, m) => {
    setModalMsg(m);
    setModalVisible(b);
  }

  // change popup/modal visible
  const changeLoadingVisible = (b) => {
    setIsLoading(b);
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

  useEffect(() => {
    fetchGoalsData();
    fetchLevelData();
  }, []);

  useEffect(() => {
    if (levelData.length > 0) {
        const capitalizedLevelData = levelData.map(level => ({
            ...level,
            name: capitalizeFirstLetter(level.name),
        }));
        // Only update state if there is a change
        if (JSON.stringify(capitalizedLevelData) !== JSON.stringify(levelData)) {
            setLevelData(capitalizedLevelData);
        }
    }
}, [levelData]); // This effect will run whenever levelData changes

  const fetchGoalsData = async () => {
    try {
      setIsLoading(true);
      await new RegisterPresenter({ fetchGoalsData: setGoalsData }).getGoals();
      setIsLoading(false);
    } catch (error) {
      setModalVisible(true);
      setModalMsg(error.message);
      console.error("Error fetching goals data: ", error);
    }
  };

  const fetchLevelData = async () => {
    try {
      setIsLoading(true);
      await new RegisterPresenter({ fetchLevelData: setLevelData }).getLevel();
      setIsLoading(false);
    } catch (error) {
      setModalVisible(true);
      setModalMsg(error.message);
      console.error("Error fetching level data: ", error);
    }
  };

  const processProfiling = async (gender, dob, weight, height, goal, level, medicalCheck, intervalInSeconds) => {
    try {
      // Call the presenter to process the profiling
      await new RegisterPresenter().processProfiling(gender, dob ? dob.toISOString() : null, weight, height, goal, level, medicalCheck, intervalInSeconds);
      // Navigate to the next screen
      navigation.navigate('Register2', { gender, dob: dob ? dob.toISOString() : null, weight, height, goal, level, medicalCheck, intervalInSeconds });
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
      <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
        <LoadingDialog />
      </Modal>
      <Modal transparent={true} animationType='fade' visible={modalVisible} nRequestClose={() => changeModalVisible(false)}>
        <MessageDialog message={modalMsg} changeModalVisible={changeModalVisible} />
      </Modal>
      <View style={styles.orange}>
        <View style={styles.container2}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Gender</Text>
            <Dropdown
              style={styles.dropdown}
              data={genderData}
              labelField="label"
              valueField="value"
              placeholder="Select Gender"
              value={gender}
              onChange={item => {
                setGender(item.value);
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <View>
                <Text style={styles.dateContainer}>{dob ? formatDate(dob) : "Select date of birth"}</Text>
              </View>
            </TouchableOpacity>
            <DatePicker
              modal
              open={open}
              date={dob || new Date()}
              mode='date'
              minimumDate={new Date(1900, 0, 1)}
              maximumDate={new Date()}
              onConfirm={(date) => {
                setOpen(false);
                setDob(date);
              }}
              onCancel={() => {
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
            <Text style={styles.label}>Fitness Goal</Text>
            <Dropdown
              style={styles.dropdown}
              data={goalsData.map(goal => ({ label: goal.name, value: goal.id }))}
              labelField="label"
              valueField="value"
              placeholder="Select Goal"
              value={goal}
              onChange={item => {
                setGoal(item.value);
              }}
            />
          </View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Fitness Level</Text>
            <Dropdown
              style={styles.dropdown}
              data={levelData.map(level => ({ label: level.name, value: level.id }))}
              labelField="label"
              valueField="value"
              placeholder="Select Level"
              value={level}
              onChange={item => {
                setLevel(item.value);
              }}
            />
          </View>
          <Text style={styles.label}>Rest Interval (seconds)</Text>
          <TouchableOpacity style={styles.restIntervalButton} onPress={() => setShowPicker(true)} >
            {
              alarmString == '' ?
                <Text style={styles.restIntervalText}>Set interval</Text>
                :
                <Text style={styles.restIntervalText}>Selected Interval: {alarmString} seconds</Text>
            }

          </TouchableOpacity>
          <TimerPickerModal
            hideHours
            visible={showPicker}
            setIsVisible={setShowPicker}
            onConfirm={handleRestConfirm}
            modalTitle="Set Interval (20s - 120s)"
            onCancel={() => setShowPicker(false)}
            closeOnOverlayPress
            styles={{
              theme: "dark",
            }}
            modalProps={{
              overlayOpacity: 0.2,
            }}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              checked={medicalCheck}
              onPress={() => setmedicalCheck(!medicalCheck)}
              title={
                <Text style={{ marginLeft: scale(10), maxWidth: '100%' }}>
                  I have a medical condition that might affect my ability to exercise.
                </Text>}
              iconType="material-community"
              checkedIcon="checkbox-outline"
              uncheckedIcon={'checkbox-blank-outline'}
              checkedColor="black"
              textStyle=''
              containerStyle={{ backgroundColor: 'transparent' }}
              wrapperStyle={styles.checkboxWrapper}
            />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            processProfiling(gender, dob, weight, height, goal, level, medicalCheck, intervalInSeconds)
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
    alignItems: 'center',
    backgroundColor: 'white'
  },
  orange: {
    backgroundColor: '#E28413',
    width: '100%',
    alignItems: 'center',
    paddingTop: scale(40),
    paddingBottom: scale(40),
  },
  container2: {
    width: '90%',
    backgroundColor: '#E6E6E6',
    padding: scale(15),
    borderWidth: 2,
    borderRadius: scale(25),
    borderColor: '#C42847',
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: scale(16),
    marginTop: scale(10),
    marginBottom: scale(4),
    marginLeft: scale(2),
  },
  inputContainer: {
    width: '100%',
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdown: {
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    paddingHorizontal: scale(15),
    paddingVertical: scale(2),
    borderRadius: scale(10),

  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: scale(15),
    paddingVertical: scale(6),
    borderRadius: scale(10),
    fontFamily: 'Inter',
    fontSize: scale(16),
  },
  buttonContainer: {
    width: '75%',
    alignItems: 'center',
    marginTop: scale(30),
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
    width: '95%',
    marginTop: scale(10),
    marginLeft: scale(-15),
  },
  dateContainer: {
    fontFamily: 'Inter',
    fontSize: scale(16),
    marginBottom: scale(5),
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderRadius: scale(8),
    backgroundColor: 'white',
  },
  restIntervalButton: {
    backgroundColor: 'white',
    marginBottom: scale(5),
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderRadius: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: scale(5),
    elevation: scale(5),
    borderWidth: 2
  },
  restIntervalText: {
    fontSize: scale(16),
    fontFamily: 'Inter',
  },
})