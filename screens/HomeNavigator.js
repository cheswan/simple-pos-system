import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Pressable, View } from 'react-native';
import { globalStyles } from '../styles/global';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './HomeScreen';
import AboutScreen from './AboutScreen';
import ItemScreen from './ItemScreen';
import UploadScreen from './UploadScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import BillingScreen from './BillingScreen';
import ReceiptScreen from './ReceiptScreen';

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
  const CustomTabButton = (props) => (
    <Pressable
      {...props}
      style={
        props.accessibilityState.selected
          ? [props.style, { borderTopColor: '#FFCD44', borderTopWidth: 2 }]
          : props.style
      }
    />
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        backgroundColor={'white'}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'home-screen') {
              iconName = "home"
            } else if (route.name === 'item-screen') {
              iconName = "format-list-bulleted"
            } else if (route.name === 'billing-screen') {
              iconName = "format-list-bulleted"
            } else if (route.name === 'receipt-screen') {
              iconName = "format-list-bulleted"
            } else if (route.name === 'about-screen') {
              iconName = "information"
            } else if (route.name === 'upload-screen') {
              iconName = "information"
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#000',
          // tabBarActiveBackgroundColor: '#313131',
          // tabBarInactiveBackgroundColor: '#313131',
          tabBarStyle: { height: 70, width: '94%', backgroundColor: '#F5F5DC', marginHorizontal: '3%', marginBottom: 10, borderRadius: 100 },
          tabBarItemStyle: { paddingVertical: 10 },
          // tabBarButton: CustomTabButton,
          tabBarLabel: ({ focused, color }) => {
            let text;
            if (route.name === 'home-screen') {
              text = 'Home'
            } else if (route.name === 'item-screen') {
              text = 'Item'
            } else if (route.name === 'billing-screen') {
              text = 'Billing'
            } else if (route.name === 'receipt-screen') {
              text = 'Receipts'
            } else if (route.name === 'about-screen') {
              text = 'About'
            } else if (route.name === 'upload-screen') {
              text = 'Upload'
            }

            return <Text style={[
              globalStyles.defaultFontFamily,
              { fontSize: 12, color: focused ? "#000" : '#000' }]}>
              {text}
            </Text>
          }
        })}
      >
        <Tab.Screen
          name="home-screen"
          component={HomeScreen}
          options={{ title: 'Home', unmountOnBlur: true, }}
        />
        <Tab.Screen
          name="item-screen"
          component={ItemScreen}
          options={{ title: 'About', unmountOnBlur: true, }}
        />
        <Tab.Screen
          name="billing-screen"
          component={BillingScreen}
          options={{ title: 'About', unmountOnBlur: true, }}
        />
        <Tab.Screen
          name="receipt-screen"
          component={ReceiptScreen}
          options={{ title: 'About', unmountOnBlur: true, }}
        />
        {/* <Tab.Screen
          name="upload-screen"
          component={UploadScreen}
          options={{ title: 'About', unmountOnBlur: true, }}
        /> */}
        <Tab.Screen
          name="about-screen"
          component={AboutScreen}
          options={{ title: 'About', unmountOnBlur: true, }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}