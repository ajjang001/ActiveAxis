import React from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets  } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import {Ionicons} from '@expo/vector-icons';
import 'react-native-gesture-handler';

import LoginPage from './src/view/LoginPage';

import RegisterPage from './src/view/guest/RegisterPage';
import RegisterPage2 from './src/view/guest/RegisterPage2';
import RegisterPage3 from './src/view/guest/RegisterPage3';
import CoachRegisterPage from './src/view/guest/CoachRegisterPage';
import CoachRegisterPage2 from './src/view/guest/CoachRegisterPage2';
import ResetPasswordPage from './src/view/ResetPasswordPage';
import ResetPasswordPage2 from './src/view/ResetPasswordPage2';
import AboutOurApp from './src/view/guest/AboutOurApp';
import AboutActiveAxisPage from './src/view/guest/AboutActiveAxisPage';
import AppFeaturesPage from './src/view/guest/AppFeaturesPage';
import AppFeedBackPage from './src/view/guest/AppFeedbackPage';
import UserStatisticsPage from './src/view/guest/UserStatisticsPage';

import UserHomePage from './src/view/user/UserHomePage';

import CoachHomePage from './src/view/coach/CoachHomePage';

import SystemAdminHomePage from './src/view/system_admin/SystemAdminHomePage';
import CoachAccountListPage from './src/view/system_admin/CoachAccountListPage';
import CoachDetailsPage from './src/view/system_admin/CoachDetailsPage';
import CoachRegistrationListPage from './src/view/system_admin/CoachRegistrationListPage';
import CoachRegistrationDetailsPage from './src/view/system_admin/CoachRegistrationDetailsPage';
import PhotoViewer from './src/view/system_admin/PhotoViewer';

import SystemAdminAppDetails from './src/view/system_admin/SystemAdminAppDetails';
import SystemAdminAppFeedbacks from './src/view/system_admin/SystemAdminAppFeedbacks';
import UpdateAboutUsPage from './src/view/system_admin/UpdateAboutUsPage';
import UpdateAppFeaturesPage from './src/view/system_admin/UpdateAppFeaturesPage';
import AchievementsPage from './src/view/system_admin/AchievementsPage';
import CreateAchievementsPage from './src/view/system_admin/CreateAchievementsPage';
import EditAchievementsPage from './src/view/system_admin/EditAchievementsPage';

import SystemAdminAccountSettingPage from './src/view/system_admin/SystemAdminAccountSettingPage';
import SystemAdminUpdateAccountDetailsPage from './src/view/system_admin/SystemAdminUpdateAccountDetailsPage';

import UserAccountListPage from './src/view/system_admin/UserAccountListPage';
import UserAccountDetailsPage from './src/view/system_admin/UserAccountDetailsPage';
import EditUserAccountDetailsPage from './src/view/system_admin/EditUserAccountDetailsPage';


const Stack = createStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
     "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
     "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
     "Inter": require("./assets/fonts/Inter.ttf"),
     "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
     "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"), 
     "Fuzzy-Bubbles": require("./assets/fonts/Fuzzy-Bubbles.ttf"),
     "League-Spartan-Light": require("./assets/fonts/League-Spartan-Light.ttf"),
     "League-Spartan": require("./assets/fonts/League-Spartan.ttf"),
     "League-Spartan-SemiBold": require("./assets/fonts/League-Spartan-SemiBold.ttf"),
  });


  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen name="LoginPage" component={LoginPage} options={{headerShown:false}} />
        <Stack.Screen name="Register" component={RegisterPage} options={{title:'Back'}} />
        <Stack.Screen name="Register2" component={RegisterPage2} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}  />
        <Stack.Screen name="Register3" component={RegisterPage3} options={{headerShown:false}} />
        <Stack.Screen name = "CoachRegisterPage" component={CoachRegisterPage} options={{title:'Back' , headerStyle:{backgroundColor:'#FBF5F3'} }} />
        <Stack.Screen name = "CoachRegisterPage2" component={CoachRegisterPage2} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }} />

        <Stack.Screen name="ResetPassword" component={ResetPasswordPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        {/*Reset Password 2 might be deleted*/}
        <Stack.Screen name="ResetPassword2" component={ResetPasswordPage2} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>
        <Stack.Screen name="AboutOurApp" component={AboutOurApp} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'} }}/>
        <Stack.Screen name="AboutActiveAxisPage" component={AboutActiveAxisPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="AppFeaturesPage" component={AppFeaturesPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>
        <Stack.Screen name="AppFeedBackPage" component={AppFeedBackPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>
        <Stack.Screen name="UserStatisticsPage" component={UserStatisticsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>

        
        <Stack.Screen name="UserHomePage" component={UserHomePage} />
        <Stack.Screen name="SystemAdminHomePage" component={SystemAdminHomePage} options={{headerShown:false}} />
        <Stack.Screen name="CoachAccountListPage" component={CoachAccountListPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS}} />
        <Stack.Screen name = "CoachDetailsPage" component={CoachDetailsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name = "CoachRegistrationListPage" component={CoachRegistrationListPage} options={({navigation}) =>({
            title:'Back', 
            headerStyle:{backgroundColor:'#FBF5F3'}, 
            headerLeft:()=>(
              <TouchableOpacity onPress={() => navigation.navigate('CoachAccountListPage', {refresh:true})}>
                <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15 }} />
              </TouchableOpacity>
            ),
            ...TransitionPresets.SlideFromRightIOS })} 
        />
        <Stack.Screen name = "CoachRegistrationDetailsPage" component={CoachRegistrationDetailsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name = "PhotoViewer" component={PhotoViewer} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }} />

        <Stack.Screen name="SystemAdminAppDetails" component={SystemAdminAppDetails} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="SystemAdminAppFeedbacks" component={SystemAdminAppFeedbacks} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }} />
        <Stack.Screen name="UpdateAboutUsPage" component={UpdateAboutUsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>
        <Stack.Screen name="UpdateAppFeaturesPage" component={UpdateAppFeaturesPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>
        <Stack.Screen name="AchievementsPage" component={AchievementsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>
        <Stack.Screen name="CreateAchievementsPage" component={CreateAchievementsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>
        <Stack.Screen name="EditAchievementsPage" component={EditAchievementsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>

        <Stack.Screen name="UserAccountListPage" component={UserAccountListPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>  
        <Stack.Screen name="UserAccountDetailsPage" component={UserAccountDetailsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/> 
        <Stack.Screen name="EditUserAccountDetailsPage" component={EditUserAccountDetailsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>     
        <Stack.Screen name="SystemAdminAccountSettingPage" component={SystemAdminAccountSettingPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>
        {/*SystemAdminUpdateAccountDetailsPage might be deleted*/}
        <Stack.Screen name="SystemAdminUpdateAccountDetailsPage" component={SystemAdminUpdateAccountDetailsPage} options={{title:'Back', headerStyle:{backgroundColor:'#FBF5F3'}, ...TransitionPresets.SlideFromRightIOS }}/>

        <Stack.Screen name="CoachHomePage" component={CoachHomePage}   />
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
