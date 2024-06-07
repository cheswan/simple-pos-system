import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { globalStyles } from '../styles/global';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageHeader from '../components/header/PageHeader';

const HomeScreen = () => {
  const navigation = useNavigation();
  const currentUser = useSelector((state) => state.currentUser.value);

  const navigateReset = (name) => {
    navigation.reset({
      index: 0,
      routes: [{ name }],
    });
  };

  const logout = async () => {
    await storeData('CURRENT_USER_ID', '');
    navigateReset('login-screen');
  };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

  return (
    <View style={styles.container}>
      <PageHeader title={"Home"} noBack />
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeMessage}>Welcome, {currentUser.email}</Text>
        <Button icon="logout" mode="contained" onPress={logout} style={styles.logoutButton}>
          Log-out
        </Button>
      </View>
      <View style={[globalStyles.h100, globalStyles.alignCenter, globalStyles.justifyCenter]}>
        <Image source={require('../assets/splash.jpg')} style={styles.splashImage} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#978A84', // Soft blue background color for the entire app
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  welcomeMessage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  splashImage: {
    width: 750,
    height: 750,
    resizeMode: 'contain',
  },
  logoutButton: {
    marginLeft: 'auto',
  },
});
