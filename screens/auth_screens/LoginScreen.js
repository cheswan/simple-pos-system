import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalStyles } from '../../styles/global.js'
import { TextInput, Card, Button } from "react-native-paper"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from "../../firebase/app/firebaseConfig.js"
import { setCurrentUser } from '../../app/slice/currentUserSlice';
import { useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailReg, setEmailReg] = useState("")
  const [passwordReg, setPasswordReg] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigation = useNavigation()
  const navigateReset = (name) => {
    navigation.reset({
      index: 0,
      routes: [{ name }],
    });
  }
  const login = () => {
    console.log({ email, password });
    // return;
    auth.signInWithEmailAndPassword(email, password)
      .then(
        res => {
          console.log({ currentUser: res.user });
          const dbRef = database.ref()
          dbRef.child("users").child(res.user.uid).get()
            .then((snapshot) => {
              if (snapshot.exists()) {
                console.log('snapshot', snapshot.val());
                storeData('CURRENT_USER_ID', res.user.uid)
                dispatch(setCurrentUser(snapshot.val()))
                navigateReset('home')
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
              console.error(error);
            });
        },
        err => {
          console.log({ errFirebase: err.message, code: err.code });
        })
  }

  const register = () => {
    auth.createUserWithEmailAndPassword(emailReg, passwordReg)
      .then(
        res => {
          const userId = res.user.uid
          database.ref('users/' + userId).set({ id: userId, email: emailReg, displayName: displayName })
            .then(
              res => {
                setDisplayName("")
                setEmailReg("")
                setPasswordReg("")
                Alert.alert('Register', "You have been successfully registered.")
              },
              err => {
                console.log({ err });
              }
            );
        },
        err => {
          console.log({ errFirebase: err.message, code: err.code });
        })
  }

  const storeData = async (key, value) => {
    try {
      // value = JSON.stringify(value);
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[
        globalStyles.pa20,
        globalStyles.alignCenter,
        globalStyles.justifyCenter,
        globalStyles.primaryColor,
        { flexGrow: 1 }]
      }>
        <Card mode='elevated' elevation={3} style={[globalStyles.w100, { backgroundColor: '#fff' }]}>
          <Card.Content>
            <Text style={[globalStyles.textCenter, globalStyles.fontWeightBold, { fontSize: 40 }]}>Kleanest Cafe</Text>
            <View>
              <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                mode='outlined'
                dense={true}
                style={[globalStyles.mb10, globalStyles.mt10]}
              />
            </View>
            <View>
              <TextInput
                label="Password"
                value={password}
                onChangeText={text => setPassword(text)}
                mode='outlined'
                dense={true}
                secureTextEntry={!showPassword}
              />
              <Pressable style={{ position: 'absolute', right: 4, top: 12 }} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <MaterialCommunityIcons style={{}} name={'eye-off'} size={30} color={'#000'} />
                  : <MaterialCommunityIcons style={{}} name={'eye'} size={30} color={'#000'} />}
              </Pressable>
            </View>
            <View style={[globalStyles.mt10]}>
              <Button icon="login" mode="contained" onPress={() => login()}>
                Login
              </Button>
            </View>
          </Card.Content>
        </Card>
        <Card mode='elevated' elevation={3} style={[globalStyles.w100, { backgroundColor: '#fff', marginTop: 20 }]}>
          <Card.Content>
            <Text style={[globalStyles.textCenter, globalStyles.fontWeightBold, { fontSize: 40 }]}>REGISTER</Text>
            <View>
              <TextInput
                label="Email"
                value={emailReg}
                onChangeText={text => setEmailReg(text)}
                mode='outlined'
                dense={true}
                style={[globalStyles.mb10, globalStyles.mt10]}
              />
            </View>
            <View>
              <TextInput
                label="Display Name"
                value={displayName}
                onChangeText={text => setDisplayName(text)}
                mode='outlined'
                dense={true}
                style={[globalStyles.mb10]}
              />
            </View>
            <View>
              <TextInput
                label="Password"
                value={passwordReg}
                onChangeText={text => setPasswordReg(text)}
                mode='outlined'
                dense={true}
                secureTextEntry={!showPassword}
              />
              <Pressable style={{ position: 'absolute', right: 4, top: 12 }} onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <MaterialCommunityIcons style={{}} name={'eye-off'} size={30} color={'#000'} />
                  : <MaterialCommunityIcons style={{}} name={'eye'} size={30} color={'#000'} />}
              </Pressable>
            </View>
            <View style={[globalStyles.mt10]}>
              <Button icon="login" mode="contained" onPress={() => register()}>
                Register
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
})