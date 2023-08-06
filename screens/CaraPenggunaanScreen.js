// screens/HomeScreen.js
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const CaraPenggunaanScreen = () => {
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={{backgroundColor:"white",justifyContent:"center",alignItems:"center",paddingTop:10}}>
          <Image source={require("../assets/caraPenggunaan.png")}/>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default CaraPenggunaanScreen;
