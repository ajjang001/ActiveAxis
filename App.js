import React from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';

import LoginPage from './src/view/LoginPage';
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
import UserHomePage from './src/view/UserHomePage';
import CoachHomePage from './src/view/CoachHomePage';
import SystemAdminHomePage from './src/view/SystemAdminHomePage';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins SemiBold": require("./assets/fonts/Poppins SemiBold.ttf"),
    "Poppins Medium": require("./assets/fonts/Poppins Medium.ttf"),
    "Inter": require("./assets/fonts/Inter.ttf"),
    "Inter SemiBold": require("./assets/fonts/Inter SemiBold.ttf"),
    "Inter Medium": require("./assets/fonts/Inter Medium.ttf"), 
    "Fuzzy Bubbles": require("./assets/fonts/Fuzzy Bubbles.ttf"), 
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown:false}} />
        <Stack.Screen name="Register" component={RegisterPage} options={{title:'Back'}} />
        <Stack.Screen name="Register2" component={RegisterPage2} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}  />
        <Stack.Screen name="Register3" component={RegisterPage3} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="ResetPassword2" component={ResetPasswordPage2} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="AboutOurApp" component={AboutOurApp} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="AboutActiveAxis" component={AboutActiveAxis} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }} />
        <Stack.Screen name="FunctionsFeatures" component={FunctionsFeatures} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="AppFeedbacks" component={AppFeedbacks} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="UserStatistics" component={UserStatistics} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>

        
        <Stack.Screen name="UserHomePage" component={UserHomePage} />
        <Stack.Screen name="SystemAdminHomePage" component={SystemAdminHomePage} />
        <Stack.Screen name="CoachHomePage" component={CoachHomePage} />
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
