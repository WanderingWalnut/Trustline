import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProtectionScreen from '../screens/ProtectionScreen';

export type RootStackParamList = {
  Protection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Protection" component={ProtectionScreen} />
    </Stack.Navigator>
  );
}
