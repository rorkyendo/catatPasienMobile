// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreenScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import CaraPenggunaanScreen from './screens/CaraPenggunaanScreen';
import TentangScreen from './screens/TentangScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
    <Stack.Screen
        name="Splash"
        component={SplashScreenScreen}
        options={{ headerShown: false }}
      />
    <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }}
        />
    <Stack.Screen 
        name="Cara Penggunaan" 
        component={CaraPenggunaanScreen}
        options={{ headerShown: true }}
        />
    <Stack.Screen 
        name="Tentang" 
        component={TentangScreen}
        options={{ headerShown: true }}
        />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
