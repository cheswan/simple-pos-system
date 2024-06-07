import React from 'react';
import {
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import _ from "lodash"

export default function LoadingComponent({ isLoading, overlay }) {

  const LoadingComponent = () => {
    return isLoading ?
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 }}>
        <ActivityIndicator size="small" color="#F38E00" />
        <Text>Loading... </Text>
      </View>
      : null
  }

  const LoadingComponentOverlay = () => {
    return isLoading ?
      <View style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffffaa',
        zIndex: 999,
      }}>
        <LoadingComponent />
      </View>
      : null
  }

  return (
    !!overlay ? <LoadingComponentOverlay /> :
      <LoadingComponent />
  );
}