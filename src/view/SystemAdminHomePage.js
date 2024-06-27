import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale} from '../components/scale';

const SystemAdminHomePage = ({route}) => {
    // Get the admin from the route params
    const {admin} = route.params;

    const options = [
        {label: 'Account Settings', onPress: () => console.log('Account Settings')},
        {label: 'Achievements', onPress: () => console.log('Achievements')},
        {label: 'User Account List', onPress: () => console.log('User Account List')},
        {label: 'App Details', onPress: () => console.log('App Details')},
        {label: 'App Feedbacks', onPress: () => console.log('App Feedbacks')},
        {label: 'Coach Account List', onPress: () => console.log('Coach Account List')},
        {label: 'Log Out', onPress: () => console.log('Logout')}
    ];

    return (
        <ScrollView style = {styles.container}>
            <View style = {styles.textContainer}>
                <Text style = {styles.topText}>{admin.username}</Text>
                <Text style = {styles.topText}>{admin.email}</Text>
            </View>

            {
                options.map((option, index) => (
                    <TouchableOpacity key={index} style = {styles.optionButton}>
                        <Text style = {styles.buttonText} onPress = {option.onPress}>{option.label}</Text>
                    </TouchableOpacity>
                ))
                
            }


            
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#C42847',
        marginVertical: scale(50),
    },
    textContainer:{
        padding: scale(30),
    }
    ,
    topText:{
        fontFamily:'Inter-SemiBold',
        fontSize: scale(20),
        color: 'white',
    },
    optionButton:{
        borderWidth: scale(1),
        backgroundColor: '#D9D9D9',
        marginBottom: scale(10),
        width: '100%',


    },
    buttonText:{
        fontFamily:'League-Spartan-Light',
        fontSize: scale(20),
        padding: scale(15),
        paddingVertical: scale(25),


    }
});


export default SystemAdminHomePage;