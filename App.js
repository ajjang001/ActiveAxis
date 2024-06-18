import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from './src/view/LoginPage';
import UserHomePage from './src/view/UserHomePage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage" screenOptions={{headerShown:false}}>
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="UserHomePage" component={UserHomePage} />
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