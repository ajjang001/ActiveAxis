import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { scale } from "../../components/scale";

const RegisterPage3 = ({ navigation }) => {

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <Text style={styles.header}>Verification</Text>
            <View style={styles.container2}>
            <Text style={styles.header2}>We have sent you a verification link to your email.{"\n"}Kindly verify your account before logging in.</Text>
                
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('LoginPage')
                    }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Click here to Login!</Text>
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


export default RegisterPage3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBF5F3',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    header2: {
        fontSize: 15,
        paddingTop: scale(10),
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
    },
    container2: {
        justifyContent: 'center',
        backgroundColor: '#E6E6E6',
        width: '90%',
        alignItems: 'center',
        borderRadius: scale(25),
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
        borderRadius: scale(10),
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