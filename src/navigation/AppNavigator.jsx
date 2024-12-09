import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import StartButtonScreen from '../screens/StartButtonScreen';
import LightIconScreen from '../screens/LightIconScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Start" component={StartButtonScreen} />
      <Stack.Screen name="LightIcon" component={LightIconScreen} />
    </Stack.Navigator>
  );
}
