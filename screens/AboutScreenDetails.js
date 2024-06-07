import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalStyles } from '../styles/global'
import { useNavigation } from '@react-navigation/native';
import { Button } from "react-native-paper"
import PageHeader from '../components/header/PageHeader';

const AboutScreenDetails = ({ route }) => {
  const [params, setParams] = useState(route.params || {})
  useEffect(() => {
    console.log({ params: route.params });
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <PageHeader title="About Screen Detail"></PageHeader>
        <View style={[globalStyles.h100, globalStyles.alignCenter, globalStyles.justifyCenter]}>
          <Text>AboutScreenDetails - {params.sampleData}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AboutScreenDetails

const styles = StyleSheet.create({})