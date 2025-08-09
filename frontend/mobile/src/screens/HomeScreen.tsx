import { View, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import ThemedText from '../components/ThemedText';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigations/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <ThemedText size="lg" weight="bold">Hello, React Native 👋</ThemedText>
      <ThemedText dim>Expo + TS + React Navigation</ThemedText>
      <PrimaryButton label="Go to Details" onPress={() => navigation.navigate('Details', { id: '42' })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
});
