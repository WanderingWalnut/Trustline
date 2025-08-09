import { View, StyleSheet } from 'react-native';
import ThemedText from '../components/ThemedText';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigations/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ route }: Props) {
  const id = route.params?.id ?? 'n/a';
  return (
    <View style={styles.container}>
      <ThemedText size="lg" weight="bold">Details</ThemedText>
      <ThemedText>Item ID: {id}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
});
