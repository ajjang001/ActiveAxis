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
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Register2" component={RegisterPage2} />
        <Stack.Screen name="Register3" component={RegisterPage3} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordPage} />
        <Stack.Screen name="ResetPassword2" component={ResetPasswordPage2} />
        <Stack.Screen name="AboutOurApp" component={AboutOurApp} />
        <Stack.Screen name="AboutActiveAxis" component={AboutActiveAxis} />
        <Stack.Screen name="FunctionsFeatures" component={FunctionsFeatures} />
        <Stack.Screen name="AppFeedbacks" component={AppFeedbacks} />
        <Stack.Screen name="UserStatistics" component={UserStatistics} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*
function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // handle user state changes
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  // After authentication....
  useEffect(() => {
    // to check if the user is logged in or not
    // if logged in, user will be redirected to the home page
    // otherwise, user will be redirected to the login page
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    
    return subscriber; 
  }, []);
  if(initializing) return null;

  if(!user){
    // Here need Registration and other Guest Page
    return(
        <Stack.Navigator>
          <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown:false}} />
        </Stack.Navigator>
    );
  }



  // when the state change
  return (
      <Stack.Navigator>
        <Stack.Screen name="homepage" component={homepage} options={{headerShown:false}} />
      </Stack.Navigator>
  );
}

export default ()=>{
  return(
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
