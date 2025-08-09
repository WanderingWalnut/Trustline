// src/screens/ProtectionScreen.tsx
import * as React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Pressable } from 'react-native';
import colors from '../constants/color';          // or ../constants/colors if you renamed
import { sx, sy, fs } from '../utils/designScale';

const PROFILE_ICON = require('../../assets/profile.png');   // <-- put your files here
const SETTINGS_ICON = require('../../assets/settings.png');

export default function ProtectionScreen() {
  const [on, setOn] = React.useState(false);

  return (
    <SafeAreaView style={styles.root}>
      {/* Header left */}
      <View style={styles.headerText}>
        <Text style={styles.brand}>Trustline</Text>
        <Text style={styles.subtitle}>Scam call protection</Text>
      </View>

      {/* Header right (your image assets) */}
      <View style={styles.headerIcons}>
        <Image source={PROFILE_ICON} style={styles.icon} resizeMode="contain" />
        <Image source={SETTINGS_ICON} style={[styles.icon, { marginLeft: sx(12) }]} resizeMode="contain" />
      </View>

      {/* Greeting */}
      <View style={styles.greetingRow}>
        <Text style={styles.hello}>Hello, </Text>
        <Text style={styles.name}>Adam</Text>
      </View>

      {/* Bottom block — centered */}
      <View style={styles.bottomBlock}>
        <Text style={styles.toggleLabel}>{on ? 'turn off' : 'turn on'}</Text>

        <Pressable
          onPress={() => setOn(v => !v)}
          style={({ pressed }) => [
            styles.powerBtn,
            {
              backgroundColor: on ? colors.onOrange : colors.offBlue,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Text style={styles.powerGlyph}>⏻</Text>
        </Pressable>

        <Text style={styles.statusText}>{on ? 'connected' : 'Not connected'}</Text>
      </View>
    </SafeAreaView>
  );
}

const BUTTON_DIAMETER = sx(137); // matches your Figma width

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  /* ---- header ---- */
  headerText: {
    position: 'absolute',
    left: sx(28),
    top: sy(60),
  },
  brand: { fontSize: fs(20), fontWeight: '700', color: '#000' },
  subtitle: { marginTop: sy(4), fontSize: fs(20), color: '#1B2CC1' },

  headerIcons: {
    position: 'absolute',
    right: sx(16),
    top: sy(40),
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: { width: sx(28), height: sx(28) }, // tweak if your PNGs look off

  /* ---- greeting ---- */
  greetingRow: {
    position: 'absolute',
    left: sx(28),
    top: sy(140),
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  hello: { fontSize: fs(36), color: '#000' },
  name: { fontSize: fs(36), color: '#2563EB', textDecorationLine: 'underline' },

  /* ---- bottom block (centers button) ---- */
  bottomBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: sy(90),                // push higher/lower as you like
    alignItems: 'center',
  },
  toggleLabel: { fontSize: fs(14), color: '#1B2CC1', marginBottom: sy(8) },
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
  powerGlyph: { fontSize: fs(40), color: '#fff', marginBottom: sy(2) },
  statusText: { marginTop: sy(10), fontSize: fs(14), color: '#6B7280' },
});
