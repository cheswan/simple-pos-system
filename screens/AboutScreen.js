import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/global'
import { useNavigation } from '@react-navigation/native';
import { Button } from "react-native-paper"
import PageHeader from '../components/header/PageHeader';

const AboutScreen = () => {
  const navigation = useNavigation()

  return (
    <View style={{ flex: 1 }}>
      <PageHeader title={"About"} noBack />
      <View style={[globalStyles.h100, globalStyles.alignCenter, globalStyles.justifyCenter]}>
        <Text>AboutScreen</Text>
        <Button mode="contained" onPress={() => navigation.navigate('about-screen-detail', { sampleData: "hello" })}>
          About Screen Detail
        </Button>
      </View>
    </View>
  )
}

export default AboutScreen

const styles = StyleSheet.create({})