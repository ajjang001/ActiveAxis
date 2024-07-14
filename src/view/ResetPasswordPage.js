import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View, Modal, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ActionDialog, LoadingDialog, MessageDialog } from '../components/Modal';
import ResetPasswordPresenter from '../presenter/ResetPasswordPresenter';
import { scale } from "../components/scale";

const ResetPasswordPage = ({ navigation }) => {
    // state variables
    const [email, setEmail] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    // Function to change the visibility of the modal
    const changeLoadingVisible = (b) => {
        setIsLoading(b);
    }

    // Function to reset the password
    const processResetPassword = async (email) => {
        try {
            changeLoadingVisible(true);
            await new ResetPasswordPresenter().processResetPassword(email);
            Alert.alert("Kindly check your email to reset your password!");
            navigation.navigate('LoginPage')
        } catch (e) {
            Alert.alert(e.message);
        } finally {
            changeLoadingVisible(false);
        }
    };
    
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Text style={styles.header}>Reset Password</Text>
            <View style={styles.container2}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Enter your email"
                        autoCapitalize='none'
                        value={email}
                        onChangeText={text => setEmail(text.toLowerCase())}
                        style={styles.input}
                    />
                    {/* <Text style={styles.label}>Email Verification Code</Text>
                    <TextInput
                        placeholder="Enter the email verification code"
                        // value = { }
                        // onChangeText = {text => }
                        style={styles.input}
                        maxLength={6}
                        keyboardType="phone-pad"
                        returnKeyType='done'
                    /> */}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Modal transparent={true} animationType='fade' visible={isLoading} nRequestClose={() => changeLoadingVisible(false)}>
                    <LoadingDialog />
                </Modal>
                <TouchableOpacity
                    onPress={() => processResetPassword(email)}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>VERIFY</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomDesign}>
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

export default ResetPasswordPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
    },
    header: {
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
        marginTop: scale(5),
        marginBottom: scale(5),
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '95%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: scale(10),
        paddingVertical: scale(10),
        borderRadius: 10,
    },
    buttonContainer: {
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: scale(30),
        marginBottom: scale(150),
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
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
})