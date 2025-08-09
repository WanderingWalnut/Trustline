// src/screens/ProtectionScreen.tsx
import * as React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, Pressable } from 'react-native';
import colors from '../constants/color';
import { sx, sy, fs } from '../utils/designScale';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigations/RootNavigator';

const PROFILE_ICON = require('../../assets/profile.png');
const SETTINGS_ICON = require('../../assets/settings.png');

const BUTTON_DIAMETER = sx(160);
const POWER_SIZE = Math.round(BUTTON_DIAMETER * 0.40);

type Rt = RouteProp<RootStackParamList, 'Protection'>;

export default function ProtectionScreen() {
  const { params } = useRoute<Rt>();
  const [on, setOn] = React.useState(false);

  // Extract from params (fallback if undefined)
  const firstName = params?.firstName ?? 'User';
  const lastName = params?.lastName ?? '';

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        {/* Header without logo */}
        <View style={[styles.headerRow, { marginTop: sy(36) }]}>
          <View>
            <Text style={styles.brand}>Trustline</Text>
            <Text style={styles.subtitle}>Scam call protection</Text>
          </View>

          <View style={styles.iconsRow}>
            <Image source={SETTINGS_ICON} style={[styles.icon, { marginLeft: sx(12) }]} />
          </View>
        </View>

        {/* Greeting */}
        <Text style={[styles.greeting, { marginTop: sy(30) }]}>
          <Text style={styles.hello}>Hello, </Text>
          <Text style={styles.name}>
            {firstName}{lastName ? ` ${lastName}` : ''}
          </Text>
        </Text>

        <View style={{ flex: 1 }} />

        {/* Controls */}
        <View style={styles.controls}>
          <Text style={styles.toggleLabel}>{on ? 'turn off' : 'turn on'}</Text>

          <Pressable
            onPress={() => setOn(v => !v)}
            style={({ pressed }) => [
              styles.powerBtn,
              {
                backgroundColor: on ? colors?.onOrange ?? '#E67E22' : colors?.offBlue ?? '#1E3A8A',
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Text style={styles.powerGlyph}>⏻</Text>
          </Pressable>

          <Text style={styles.statusText}>{on ? 'Connected' : 'Not connected'}</Text>
        </View>

        <View style={{ height: sy(24) }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  content: {
    flex: 1,
    paddingHorizontal: sx(20),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: { fontSize: fs(18), fontWeight: '700', color: '#0A0A0A' },
  subtitle: { marginTop: sy(4), fontSize: fs(16), color: '#1B2CC1', fontWeight: '500' },
  iconsRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: sx(20), height: sx(20), resizeMode: 'contain' },

  greeting: { lineHeight: fs(42) },
  hello: { fontSize: fs(38), color: '#111', fontWeight: '300' },
  name: { fontSize: fs(38), color: '#2563EB', fontWeight: '300' },

  controls: {
    alignItems: 'center',
    paddingBottom: sy(12),
  },
  toggleLabel: { fontSize: fs(18), color: '#1B2CC1', marginBottom: sy(10) },

  powerBtn: {
    width: BUTTON_DIAMETER,
    height: BUTTON_DIAMETER,
    borderRadius: BUTTON_DIAMETER / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  powerGlyph: { fontSize: POWER_SIZE, color: '#fff' },

  statusText: {
    marginTop: sy(12),
    fontSize: fs(18),
    color: '#1B2CC1',
    textDecorationLine: 'underline',
  },
});
