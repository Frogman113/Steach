import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CustomerSetupScreen from '../screens/CustomerSetupScreen';
import RecordingScreen from '../screens/RecordingScreen';
import CustomerListScreen from '../screens/CustomerListScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Start" component={CustomerListScreen} />
      <Stack.Screen name="Recording" component={RecordingScreen} />
      <Stack.Screen name="CustomerSetup" component={CustomerSetupScreen} />
    </Stack.Navigator>
  );
}
