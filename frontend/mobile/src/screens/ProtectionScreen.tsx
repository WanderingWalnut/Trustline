import * as React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Update the import path below if your colors file is located elsewhere, for example:
import colors from '../constants/color';
// Or create the file './constants/colors.ts' if it doesn't exist.
import PowerButton from '../components/Powerbutton';
import { sx, sy, fs } from '../utils/designScale';

export default function ProtectionScreen() {
  const [on, setOn] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top-right icons (Figma: person 32x48 @ top50 left296; settings 34x61 @ top43 left329) */}
      <View style={[styles.iconWrap, { top: sy(50), left: sx(296) }]}>
        <Ionicons name="person-circle-outline" size={sx(28)} color={colors.text} />
      </View>
      <View style={[styles.iconWrap, { top: sy(43), left: sx(329) }]}>
        <Ionicons name="settings-outline" size={sx(28)} color={colors.text} />
      </View>

      {/* Brand (Trustline @ top63 left27, 20px bold) */}
      <Text style={[styles.brand, { top: sy(63), left: sx(27) }]}>Trustline</Text>

      {/* Subtitle (Scam call protection @ top85 left28, 20px, #1B2CC1) */}
      <Text style={[styles.subtitle, { top: sy(85), left: sx(28) }]}>
        Scam call protection
      </Text>

      {/* Greeting (Hello, Adam @ top146 left28, 36px; Adam blue + underline) */}
      <View style={[styles.greetingRow, { top: sy(146), left: sx(28) }]}>
        <Text style={styles.hello}>Hello, </Text>
        <Text style={styles.name}>Adam</Text>
      </View>

      {/* Label above button */}
      <Text style={[styles.toggleLabel, { top: sy(545), left: sx(170) }]}>
        {on ? 'turn off' : 'turn on'}
      </Text>

      {/* Power button: ellipse 137×142 @ top579 left128 → use diameter 137 */}
      <View style={[styles.absolute, { top: sy(579), left: sx(128) }]}>
        <PowerButton
          on={on}
          onToggle={() => setOn(v => !v)}
          diameter={sx(137)}
          colorOn={colors.onOrange}
          colorOff={colors.offBlue}
        />
      </View>

      {/* Status text below button */}
      <Text style={[styles.status, { top: sy(730), left: sx(168) }]}>
        {on ? 'connected' : ''}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  absolute: { position: 'absolute' },
  iconWrap: { position: 'absolute' },

  brand: {
    position: 'absolute',
    fontSize: fs(20),
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    position: 'absolute',
    fontSize: fs(20),
    color: colors.accentBlue,
  },
  greetingRow: { position: 'absolute', flexDirection: 'row' },
  hello: { fontSize: fs(36), color: colors.text, fontWeight: '400' },
  name: {
    fontSize: fs(36),
    fontWeight: '400',
    color: colors.nameBlue,
    textDecorationLine: 'underline',
  },
  toggleLabel: {
    position: 'absolute',
    fontSize: fs(12),
    color: colors.dim,
    textTransform: 'lowercase',
  },
  status: {
    position: 'absolute',
    fontSize: fs(12),
    color: colors.dim,
    textTransform: 'lowercase',
  },
});
