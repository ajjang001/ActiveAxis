import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AboutOurApp from './src/view/AboutOurApp';
import AboutActiveAxis from './src/view/AboutActiveAxis';
import FunctionsFeatures from './src/view/FunctionsFeatures';
import AppFeedbacks from './src/view/AppFeedbacks';
import UserStatistics from './src/view/UserStatistics';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AboutOurApp">
        <Stack.Screen name="AboutOurApp" component={AboutOurApp} />
        <Stack.Screen name="AboutActiveAxis" component={AboutActiveAxis} />
        <Stack.Screen name="FunctionsFeatures" component={FunctionsFeatures} />
        <Stack.Screen name="AppFeedbacks" component={AppFeedbacks} />
        <Stack.Screen name="UserStatistics" component={UserStatistics} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
