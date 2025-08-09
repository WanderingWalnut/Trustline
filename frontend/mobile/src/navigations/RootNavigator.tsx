import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from '../screens/WelcomePage';
import ProtectionScreen from '../screens/ProtectionScreen';
import SplashScreen from '../screens/SplashScreen';
import NamePage from '../screens/NamePage';
import PrivacyPage from '../screens/PrivacyPage';
import CaregiverPage from '../screens/CaregiverPage';
import LoginCodeScreen from '../screens/LoginCode';

export type RootStackParamList = {
  SplashScreen: undefined;
  Welcome: undefined;
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
  LoginCode: { phone: string; firstName: string; lastName?: string };

  };

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Name" component={NamePage} />
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Caregiver" component={CaregiverPage} /> 
      <Stack.Screen name="Protection" component={ProtectionScreen} />
      <Stack.Screen name="Privacy" component={PrivacyPage} />
      <Stack.Screen name="LoginCode" component={LoginCodeScreen} />
    </Stack.Navigator>
  );
}