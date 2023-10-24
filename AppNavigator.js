// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreenScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import CaraPenggunaanScreen from './screens/CaraPenggunaanScreen';
import TentangScreen from './screens/TentangScreen';
import CatatPeserta from './screens/CatatPeserta';
import DaftarPesertaScreen from './screens/DaftarPeserta';
import { StatusBar } from 'react-native';

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
        options={{ headerShown: true,
            headerStyle: {
                backgroundColor: "#008B8B",
              },
              headerTitleStyle: {
                color: "white",
              },
              headerTintColor: "white"
        }}
        />
    <Stack.Screen 
        name="Tentang" 
        component={TentangScreen}
        options={{ headerShown: true,
            headerStyle: {
                backgroundColor: "#008B8B",
              },
              headerTitleStyle: {
                color: "white",
              },
              headerTintColor: "white"
        }}
        />
    <Stack.Screen 
        name="Catat Peserta" 
        component={CatatPeserta}
        options={{ headerShown: true,
            headerStyle: {
                backgroundColor: "#008B8B",
              },
              headerTitleStyle: {
                color: "white",
              },
              headerTintColor: "white"
        }}
        />
    <Stack.Screen 
        name="Daftar Peserta" 
        component={DaftarPesertaScreen}
        options={{ headerShown: true,
            headerStyle: {
                backgroundColor: "#008B8B",
              },
              headerTitleStyle: {
                color: "white",
              },
              headerTintColor: "white"
        }}
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
