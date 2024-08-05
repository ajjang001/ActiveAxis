import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Modal, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import DatePicker from 'react-native-date-picker';
import { scale } from '../../components/scale';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { ActionDialog, LoadingDialog, MessageDialog } from '../../components/Modal';

import RegisterPresenter from '../../presenter/RegisterPresenter';

const CoachRegisterPage = ({ navigation }) => {
  // state variables
  const genderData = [
    { label: 'Male', value: 'm' },
    { label: 'Female', value: 'f' },
  ];

  // state variables
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [chargePM, setChargePM] = useState('');
  const [open, setOpen] = useState(false)
  const [photo, setPhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [identification, setIdentification] = useState(null);

  // Modal/Display Message
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // format date
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // change popup/modal visible
  const changeModalVisible = (b, m) => {
    setModalMsg(m);
    setIsModalVisible(b);
  }

  // Upload Field
  const UploadField = ({ label, file, onSelect }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={onSelect} style={styles.uploadButton}>
       {file ? (
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.fileName}>
          File Uploaded: {file.name}
        </Text>
      ) : (
        <Text style={styles.uploadButtonText}>
          Upload your {label.toLowerCase()} here
        </Text>
      )}
      <Image style = {styles.uploadIcon} source = {require("../../../assets/upload_icon.png")} />
      </TouchableOpacity>
    </View>
  );

  // handle select photo
  const handleSelectPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
        const uri = asset.uri;
        let name = asset.fileName || uri.split('/').pop();
        const ext = name.split('.').pop();
        name = `photo.${ext}`;
        setPhoto({ uri, name });
      }
    });
  };

  //  handle select document
  const handleSelectDocument = async (setter, type) => {
    try {
      
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const ext = res[0].name.split('.').pop() || res[0].uri.split('.').pop();
      res[0].name = `${type}.${ext}`;
      setter({ uri: res[0].uri, name: res[0].name });
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        throw err;
      }
    }
  };

  // process profiling coach
  const processProfilingCoach = async (gender, dob, chargePM, photo, resume, certificate, identification) => {
    try {
      // Call the presenter to process the profiling
      await new RegisterPresenter().processProfilingCoach(gender, dob ? dob.toISOString() : null, chargePM, photo, resume, certificate, identification);
      // Navigate to the next screen
      navigation.navigate('CoachRegisterPage2', {gender, dob: dob ? dob.toISOString() : null, chargePM, photo, resume, certificate, identification });
    } catch (e) {
      // Show error message
      changeModalVisible(true, e.message);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.header} >Register</Text>
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
            <View style={styles.input}>
              <Text>{dob ? formatDate(dob) : "Enter your date of birth"}</Text>
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

          <Text style={styles.label}>Charge per Month (in S$)</Text>
          <TextInput
            placeholder="Enter your charge per month"
            value={chargePM}
            onChangeText={text => setChargePM(text)}
            style={styles.input}
            keyboardType="phone-pad"
            returnKeyType='done'
          />

          <UploadField label="Photo" file={photo} onSelect={handleSelectPhoto} />
          <UploadField label="Resume" file={resume} onSelect={() => handleSelectDocument(setResume, "resume")} />
          <UploadField label="Certificate" file={certificate} onSelect={() => handleSelectDocument(setCertificate, "certificate")} />
          <UploadField label="Identification" file={identification} onSelect={() => handleSelectDocument(setIdentification, "identification")} />

        </View>
        <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={() => changeModalVisible(false)}>
          <MessageDialog
            message={modalMsg}
            changeModalVisible={changeModalVisible}
          />
        </Modal>
      </View>
      <View style={styles.redBox} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            processProfilingCoach(gender, dob, chargePM, photo, resume, certificate, identification)
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>NEXT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomDesign}>
        <Text style={{ top: scale(70), zIndex: 2 }}>Already have an account? <Text style={{ fontWeight: 'bold', zIndex: 2, }} onPress={() => { navigation.navigate('LoginPage') }}>Login Now</Text></Text>
        <Svg style={{ zIndex: 1 }}
          width="1000"
          height="150"
          viewBox="0 0 360 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M442.5 120C442.5 151.549 414.144 180.934 366.352 202.575C318.789 224.113 252.906 237.5 180 237.5C107.094 237.5 41.2109 224.113 -6.35203 202.575C-54.144 180.934 -82.5 151.549 -82.5 120C-82.5 88.4511 -54.144 59.0662 -6.35203 37.4246C41.2109 15.8866 107.094 2.5 180 2.5C252.906 2.5 318.789 15.8866 366.352 37.4246C414.144 59.0662 442.5 88.4511 442.5 120Z"
            fill="url(#paint0_linear_52_26)"
            stroke="#C42847"
            strokeWidth="5"
          />
          <Defs>
            <LinearGradient
              id="paint0_linear_52_26"
              x1="180"
              y1="0"
              x2="180"
              y2="240"
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#E28413" />
            </LinearGradient>
          </Defs>
        </Svg>
      </View>
    </KeyboardAvoidingView>
  )
}
export default CoachRegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FBF5F3',
  },
  header: {
    marginTop: scale(10),
    fontSize: scale(30),
    fontWeight: 'bold',
    alignItems: 'center',
  },
  container2: {
    justifyContent: 'center',
    backgroundColor: '#E6E6E6',
    width: '90%',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: scale(15),
    paddingTop: scale(5),
    paddingBottom: scale(20),
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
    borderRadius: 10,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderRadius: 10,
  },
  redBox: {
    backgroundColor: '#C42847',
    height: scale(15),
    width: '85%',
    marginTop: scale(20),
  },
  buttonContainer: {
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(15),
  },
  button: {
    backgroundColor: '#000022',
    width: '100%',
    padding: scale(10),
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(18),
  },
  bottomDesign: {
    position: 'absolute',
    bottom: scale(-25),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  uploadButton: {
    backgroundColor: 'white',
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
    borderRadius: 10,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-between',
    width: '100%',
  },
  uploadButtonText: {
    color: '#555',
  },
  fileName: {
    marginTop: scale(5),
    color: 'black',
    width: '100%',
  },
  uploadIcon:{
    height:scale(15), 
    width:(15)
  }

});
