import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterPage from './src/view/RegisterPage';
import RegisterPage2 from './src/view/RegisterPage2';
import RegisterPage3 from './src/view/RegisterPage3';
import ResetPasswordPage from './src/view/ResetPasswordPage';
import ResetPasswordPage2 from './src/view/ResetPasswordPage2';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ResetPassword1" >
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Register2" component={RegisterPage2} />
        <Stack.Screen name="Register3" component={RegisterPage3} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordPage} />
        <Stack.Screen name="ResetPassword2" component={ResetPasswordPage2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});