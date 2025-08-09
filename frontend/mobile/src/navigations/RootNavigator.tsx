// src/navigations/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import WelcomePage from '../screens/WelcomePage';
import NamePage from '../screens/NamePage';
import CaregiverPage from '../screens/CaregiverPage';
import PrivacyPage from '../screens/PrivacyPage';
import ProtectionScreen from '../screens/ProtectionScreen';
import LoginCodeScreen from '../screens/LoginCode';
import SettingsScreen from '../screens/Settings';
import ProfileScreen from '../screens/Profile';

export type RootStackParamList = {
  SplashScreen: undefined;
  Welcome:  { phone: string };
  Name:  { phone: string };
  Caregiver: { phone: string; firstName: string; lastName?: string }; // 👈 NEW

  Privacy: {
    phone: string; firstName: string; lastName?: string;
    caregiverFirstName?: string; caregiverLastName?: string; caregiverPhone?: string;
  };
  Protection: {
    phone: string; firstName: string; lastName?: string;
    caregiverFirstName?: string; caregiverLastName?: string; caregiverPhone?: string;
  };

  LoginCode: { phone: string};
  Settings: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Name" component={NamePage} />
      <Stack.Screen name="Caregiver" component={CaregiverPage} />
      <Stack.Screen name="Privacy" component={PrivacyPage} />
      <Stack.Screen name="LoginCode" component={LoginCodeScreen} />
      <Stack.Screen name="Protection" component={ProtectionScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
