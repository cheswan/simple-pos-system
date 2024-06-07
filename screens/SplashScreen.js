import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/global'
import { SafeAreaView } from 'react-native-safe-area-context'

const SplashScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[globalStyles.h100, globalStyles.alignCenter, globalStyles.justifyCenter]}>
        <Text>Splash Screen</Text>
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = StyleSheet.create({})