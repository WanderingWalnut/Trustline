import { Pressable, Text, StyleSheet } from 'react-native';

export default function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, backgroundColor: '#2563eb' },
  pressed: { opacity: 0.85 },
  label: { color: 'white', fontWeight: '600' },
});
