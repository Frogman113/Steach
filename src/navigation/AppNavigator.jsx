import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LightIconScreen from '../screens/LightIconScreen';
import CustomerSetupScreen from '../screens/CustomerSetupScreen';
import RecordingScreen from '../screens/RecordingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Start" component={CustomerSetupScreen} />
      <Stack.Screen name="LightIcon" component={LightIconScreen} />
      <Stack.Screen name="Recording" component={RecordingScreen} />
    </Stack.Navigator>
  );
}
