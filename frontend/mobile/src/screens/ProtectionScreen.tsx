// src/screens/ProtectionScreen.tsx
import * as React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Pressable } from 'react-native';
import colors from '../constants/color';        // or ../constants/colors
import { sx, sy, fs } from '../utils/designScale';

const PROFILE_ICON = require('../../assets/profile.png');
const SETTINGS_ICON = require('../../assets/settings.png');

export default function ProtectionScreen() {
  const [on, setOn] = React.useState(false);

  return (
    <SafeAreaView style={styles.root}>
      {/* Header text (lowered) */}
      <View style={styles.headerText}>
        <Text style={styles.brand}>Trustline</Text>
        <Text style={styles.subtitle}>Scam call protection</Text>
      </View>

      {/* Icons aligned to brand row */}
      <View style={styles.headerIcons}>
        <Image source={PROFILE_ICON} style={styles.icon} />
        <Image source={SETTINGS_ICON} style={[styles.icon, { marginLeft: sx(12) }]} />
      </View>

      {/* Greeting */}
      <View style={styles.greetingRow}>
        <Text style={styles.hello}>Hello, </Text>
        <Text style={styles.name}>Adam</Text>
      </View>

      {/* Bottom block (centered) */}
      <View style={styles.bottomBlock}>
        <Text style={styles.toggleLabel}>{on ? 'turn off' : 'turn on'}</Text>

        <Pressable
          onPress={() => setOn(v => !v)}
          style={({ pressed }) => [
            styles.powerBtn,
            { backgroundColor: on ? colors.onOrange : colors.offBlue, opacity: pressed ? 0.92 : 1 },
          ]}
        >
          <Text style={styles.powerGlyph}>⏻</Text>
        </Pressable>

        <Text style={styles.statusText}>{on ? 'connected' : 'Not connected'}</Text>
      </View>
    </SafeAreaView>
  );
}

/* —— layout tweaks —— */
const BUTTON_DIAMETER = sx(157);            // bigger button (was 180 / 137)
const POWER_SIZE = BUTTON_DIAMETER * 0.45;  // icon ~45% of button

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  // Lowered header
  headerText: {
    position: 'absolute',
    left: sx(28),
    top: sy(85),     // bump this up/down to taste
  },
  brand: { fontSize: fs(20), fontWeight: '700', color: '#000' },
  subtitle: { marginTop: sy(6), fontSize: fs(20), color: '#1B2CC1' },

  // Icons aligned with brand
  headerIcons: {
    position: 'absolute',
    right: sx(16),
    top: sy(85),
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { width: sx(24), height: sx(24), resizeMode: 'contain' },

  // Greeting; no underline
  greetingRow: {
    position: 'absolute',
    left: sx(28),
    top: sy(150),
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hello: { fontSize: fs(36), color: '#000' },
  name: { fontSize: fs(36), color: '#2563EB' },

  // Centered power section
  bottomBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: sy(90),
    alignItems: 'center',
  },

  // 20px blue labels per your spec
  toggleLabel: { fontSize: fs(20), color: '#1B2CC1', marginBottom: sy(12) },
  statusText: { marginTop: sy(12), fontSize: fs(20), color: '#1B2CC1' },

  powerBtn: {
    width: BUTTON_DIAMETER,
    height: BUTTON_DIAMETER,
    borderRadius: BUTTON_DIAMETER / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  powerGlyph: { fontSize: POWER_SIZE, color: '#fff' }, // bigger icon
});
