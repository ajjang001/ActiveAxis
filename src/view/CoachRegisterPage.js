import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';

const CoachRegisterPage = ({ navigation }) => {
    const genderData = [
        { label: 'Male', value: '1' },
        { label: 'Female', value: '2' },
    ];

    const [gender, setGender] = useState(null);
    const [dob, setDob] = useState(null);
    const [chargePM, setChargePM] = useState(null);

    const [open, setOpen] = useState(false)

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding"> 
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
                            onConfirm = {(date) =>{
                                setOpen(false);
                                setDob(date);
                            }}
                            onCancel ={() => {
                                setOpen(false);
                            }}
                        />

                        <Text style={styles.label}>Charge per Month (in S$)</Text>
                        <TextInput
                            placeholder="Enter your charge per month"
                            value={chargePM}
                            onChangeText={text => setChargePM(parseFloat(text))}
                            style={styles.input}
                            keyboardType="phone-pad"
                            returnKeyType='done'
                        />

                        
                        
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={() => {
                    navigation.navigate('CoachRegisterPage2', { gender, dob : dob ? dob.toISOString() : null, chargePM })
                    console.log({ gender, dob, chargePM})
                }}
                style={styles.button}
                >
                <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
    



}
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
    

});

export default CoachRegisterPage;
