import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomePage from '../screens/WelcomePage';
import ProtectionScreen from '../screens/ProtectionScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Protection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomePage} />
      <Stack.Screen name="Protection" component={ProtectionScreen} />
    </Stack.Navigator>
  );
}