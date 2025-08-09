import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from '../screens/WelcomePage';
import ProtectionScreen from '../screens/ProtectionScreen';
import SplashScreen from '../screens/SplashScreen';
import NamePage from '../screens/NamePage';
import PrivacyPage from '../screens/PrivacyPage';

export type RootStackParamList = {
  SplashScreen: undefined;
  Welcome: undefined;
  Protection: undefined;
  Name: undefined;
  Privacy: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Privacy">
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Name" component={NamePage} />
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Protection" component={ProtectionScreen} />
      <Stack.Screen name="Privacy" component={PrivacyPage} />
    </Stack.Navigator>
  );
}