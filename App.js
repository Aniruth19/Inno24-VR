// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screen/LoginScreen';
import FormScreen from './screen/FormScreen';
import HomeScreen from './screen/HomeScreen';
import ARScreen from './screen/ARScreen';
import Community from './screen/Community';
import SavedScreen from './screen/SavedScreen';
import Try from './screen/Try';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="FormScreen" component={FormScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ARScreen" component={ARScreen} />
        <Stack.Screen name="Try" component={Try} />
        <Stack.Screen name="SavedScreen" component={SavedScreen} />
        <Stack.Screen name="Community" component={Community} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
