// screens/SplashScreen.js
import React, { useEffect } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { hideSplashScreen } from '../redux/actions';
import { useNavigation } from '@react-navigation/native';

const SplashScreenScreen = () => {
  const isLoading = useSelector((state) => state.splash.isLoading);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const prepareApp = async () => {
      // Any asynchronous tasks to be done before the app is ready can be placed here.
      // For example, you can load resources, fetch data, etc.

      // After all the async tasks are done, set isLoading to false.
      setTimeout(() => {
        dispatch(hideSplashScreen());
      }, 2000);
      navigation.navigate('Home');
    };

    prepareApp();
  }, [dispatch, navigation]);

  // Render the splash screen until isLoading becomes false.
  return isLoading ? (
    <View style={styles.container}>
      <Text style={styles.text}>Selamat Datang</Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green', // Set the background color to green
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SplashScreenScreen;
