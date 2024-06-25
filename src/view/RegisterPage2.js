import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { CheckBox } from '@rneui/themed';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import RegisterPresenter from '../presenter/RegisterPresenter';
import { LoadingDialog } from '../components/Modal';
import {MessageDialog} from '../components/Modal';



const RegisterPage2 = ({ navigation, route }) => {
    // Get data from previous screen
    const { gender, dob, weight, height, goal, level, medicalCheck } = route.params;

    // State to store the user input
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // State to store the checkbox value
    const [checkTC, setCheckTC] = useState(false);

    // Loading message
    const [isLoading, setIsLoading] = useState(false);
    
  // Modal/Display Message
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');
  
  // change loading visible
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // change popup/modal visible
    const changeModalVisible = (b, m)=>{
        setModalMsg(m);
        setIsModalVisible(b);
    }

    // Process the registration
    const processRegister = async (name, email, phone, password, checkTC, gender, dob, weight, height, goal, level, medicalCheck) => {
        try {
            // Show loading screen
            changeLoadingVisible(true);
            console.log({ name, email, password, gender, dob, weight, height, goal, level, phone, checkTC, medicalCheck })

            // Call the presenter to process the registration
            await new RegisterPresenter().processRegister(name, email, phone, password, checkTC, gender, dob, weight, height, goal, level, medicalCheck);
            // Navigate to the next screen
            navigation.navigate('Register3')
        } catch (e) {
            // Show error message
            changeModalVisible(true, e.message);
        } finally {
            // Hide loading screen
            changeLoadingVisible(false);
        }
    };
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Text style={styles.header} >Register</Text>
            <View style={styles.container2}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        placeholder="Enter your name"
                        value={name}
                        onChangeText={text => setName(text)}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0000 0000"
                        keyboardType="phone-pad"
                        maxLength={8}
                        returnKeyType='done'
                        value={phone}
                        onChangeText={text => setPhone(text)}
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Enter your email"
                        autoCapitalize='none'
                        value={email}
                        onChangeText={text => setEmail(text.toLowerCase())}
                        style={styles.input}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                    />
                </View>
            </View>
            <View style={styles.checkboxContainer}>
                <CheckBox
                    checked={checkTC}
                    onPress={() => setCheckTC(!checkTC)}
                    title={
                        <Text>
                            <Text> Agree to </Text>
                            <Text style={styles.label}>Terms & Conditions</Text>
                        </Text>}
                    iconType="material-community"
                    checkedIcon="checkbox-outline"
                    uncheckedIcon={'checkbox-blank-outline'}
                    checkedColor="black"
                    textStyle=''
                    containerStyle={{ backgroundColor: 'transparent' }}
                />
            </View>
            <Modal transparent={true} animationType='fade' visible={isModalVisible} nRequestClose={()=>changeModalVisible(false)}>
                <MessageDialog
                message = {modalMsg} 
                changeModalVisible = {changeModalVisible} 
                />
            </Modal>
            <View style={styles.buttonContainer}>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <TouchableOpacity
                    //onPress={() => processRegister(name, email, '+65'+phone, password, checkTC, gender, age, weight, height, goal, level, medicalCheck)}
                    onPress={() => processRegister(name, email, '+65'+phone, password, checkTC, gender, dob, weight, height, goal, level, medicalCheck)}
                    
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>REGISTER</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomDesign}>
                <Text style={{ top: 70, zIndex: 2 }}>Already have an account? <Text style={{ fontWeight: 'bold', zIndex: 2, }} onPress={() => { navigation.navigate('LoginPage') }}>Login Now</Text></Text>
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


export default RegisterPage2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
    },
    header: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    label: {
        paddingLeft: 5,
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    container2: {
        justifyContent: 'center',
        backgroundColor: '#E6E6E6',
        width: '90%',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 15,
        paddingTop: 5,
        paddingBottom: 20,
        borderColor: '#C42847',
        borderWidth: 3,
    },
    inputContainer: {
        width: '95%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
    },
    checkboxContainer: {
        width: '95%',
    },
    buttonContainer: {
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    button: {
        backgroundColor: '#000022',
        width: '100%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    bottomDesign: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

})