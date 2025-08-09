import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from '../screens/WelcomePage';
import ProtectionScreen from '../screens/ProtectionScreen';
import SplashScreen from '../screens/SplashScreen';

export type RootStackParamList = {
  SplashScreen: undefined;
  Welcome: undefined;
  Protection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Protection" component={ProtectionScreen} />
    </Stack.Navigator>
  );
}