import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import LoginPage from './src/view/LoginPage';
import UserHomePage from './src/view/UserHomePage';
import RegisterPage from './src/view/RegisterPage';
import RegisterPage2 from './src/view/RegisterPage2';
import RegisterPage3 from './src/view/RegisterPage3';
import ResetPasswordPage from './src/view/ResetPasswordPage';
import ResetPasswordPage2 from './src/view/ResetPasswordPage2';
import AboutOurApp from './src/view/AboutOurApp';
import AboutActiveAxis from './src/view/AboutActiveAxis';
import FunctionsFeatures from './src/view/FunctionsFeatures';
import AppFeedbacks from './src/view/AppFeedbacks';
import UserStatistics from './src/view/UserStatistics';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage" screenOptions={{headerShown:false}}>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="UserHomePage" component={UserHomePage} />
        <Stack.Screen name="Register" component={RegisterPage} options={{headerShown:true, title:'Back', }} />
        <Stack.Screen name="Register2" component={RegisterPage2} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}  />
        <Stack.Screen name="Register3" component={RegisterPage3} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordPage} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="ResetPassword2" component={ResetPasswordPage2} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="AboutOurApp" component={AboutOurApp} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="AboutActiveAxis" component={AboutActiveAxis} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }} />
        <Stack.Screen name="FunctionsFeatures" component={FunctionsFeatures} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="AppFeedbacks" component={AppFeedbacks} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="UserStatistics" component={UserStatistics} options={{headerShown:true, title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
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
