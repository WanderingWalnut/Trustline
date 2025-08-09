import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  on: boolean;
  onToggle: () => void;
  diameter: number; // already scaled
  colorOn: string;
  colorOff: string;
};

export default function PowerButton({ on, onToggle, diameter, colorOn, colorOff }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.base,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: on ? colorOn : colorOff,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Ionicons name="power" size={Math.round(diameter * 0.35)} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
