import React from "react";
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { globalStyles } from "../../styles/global";

const PageHeader = ({ title, noBack }) => {
  const navigation = useNavigation()

  const goBack = () => {
    navigation.goBack();
  }

  return <View style={[
    globalStyles.primaryColor, {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 10,
      paddingHorizontal: 60,
      paddingBottom: 10,
    }]}>
    {!!!noBack && (
      <Pressable style={{ position: 'absolute', left: 8 }} onPress={() => goBack()}>
        <View style={{ borderRadius: 12, marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons style={{ paddingStart: 0, paddingEnd: 0, paddingTop: 8, paddingBottom: 8 }}
            name={"arrow-back-ios"} size={14} color={"#fff"} />
          <Text style={[globalStyles.defaultFontFamily, globalStyles.blackText, { fontSize: 14 }]}>Back</Text>
        </View>
      </Pressable>
    )}
    <Text style={[globalStyles.defaultFontFamilyBold, globalStyles.blackText, { fontSize: 17, letterSpacing: 0.4 }]}>{title}</Text>
  </View>
}
const styles = StyleSheet.create({
  primary: {
    color: '#D4A851'
  },
});
export default PageHeader;

