// src/screens/ProtectionScreen.tsx
import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  AppState,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sx, sy, fs } from '../utils/designScale';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigations/RootNavigator';
import axios from 'axios';

const SETTINGS_ICON = require('../../assets/settings.png');

// Smaller button, responsive sizes
const BUTTON_DIAMETER = sx(160);
const POWER_SIZE = Math.round(BUTTON_DIAMETER * 0.36);

const STORAGE_ON_KEY = 'protection:isOn';
const STORAGE_START_KEY = 'protection:startAt';

type Rt = RouteProp<RootStackParamList, 'Protection'>;
type Nav = StackNavigationProp<RootStackParamList, 'Protection'>;

export default function ProtectionScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const firstName = params?.firstName ?? 'User';
  const lastName = params?.lastName ? ` ${params.lastName}` : '';

  const [on, setOn] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = React.useCallback((startAtMs: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startAtMs) / 1000)));
    }, 1000);
    setElapsed(Math.max(0, Math.floor((Date.now() - startAtMs) / 1000)));
  }, []);

  const stopTimer = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsed(0);
  }, []);

  // Load persisted on/startAt
  React.useEffect(() => {
    (async () => {
      const [onRaw, startRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_ON_KEY),
        AsyncStorage.getItem(STORAGE_START_KEY),
      ]);
      const isOn = onRaw === 'true';
      setOn(isOn);
      if (isOn && startRaw) startTimer(Number(startRaw));
    })();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimer]);

  // Re-sync when app returns to foreground
  React.useEffect(() => {
    const sub = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        const [onRaw, startRaw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_ON_KEY),
          AsyncStorage.getItem(STORAGE_START_KEY),
        ]);
        const isOn = onRaw === 'true';
        if (isOn && startRaw) startTimer(Number(startRaw));
      }
    });
    return () => sub.remove();
  }, [startTimer]);

  const toggle = async () => {
    if (on) {
      // turn OFF
      setOn(false);
      stopTimer();
      await AsyncStorage.multiRemove([STORAGE_ON_KEY, STORAGE_START_KEY]);
      await AsyncStorage.setItem(STORAGE_ON_KEY, 'false');
      // Send POST to /stop API
      try {
        await axios.post('https://0c35d4ccf451.ngrok-free.app/stop');
      } catch (err) {
        console.error('Failed to send stop request:', err);
      }
    } else {
      // turn ON
      const now = Date.now();
      setOn(true);
      startTimer(now);
      await AsyncStorage.setItem(STORAGE_ON_KEY, 'true');
      await AsyncStorage.setItem(STORAGE_START_KEY, String(now));
      // Send POST to /start API
      try {
        await axios.post('https://0c35d4ccf451.ngrok-free.app/start');
      } catch (err) {
        console.error('Failed to send start request:', err);
      }
    }
  };

  const hhmmss = (s: number) => {
    const hh = Math.floor(s / 3600).toString().padStart(2, '0');
    const mm = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Split screen into top (brand + greeting) and bottom (controls) */}
      <View style={styles.screen}>
        {/* TOP */}
        <View style={styles.top}>
          {/* Header with bigger settings icon */}
          <View style={[styles.headerRow, { marginTop: sy(20) }]}>
            <View>
              <Text style={styles.brand}>Trustline</Text>
              <Text style={styles.subtitle}>Scam call protection</Text>
            </View>
            <Pressable
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() => navigation.navigate('Settings')}
            >
              <Image source={SETTINGS_ICON} style={styles.settingsIcon} />
            </Pressable>
          </View>

          {/* Greeting */}
          <Text style={[styles.greeting, { marginTop: sy(18) }]}>
            <Text style={styles.hello}>Hello, </Text>
            <Text style={styles.name}>{firstName}{lastName}</Text>
          </Text>
        </View>

        {/* BOTTOM (pinned near bottom on all devices) */}
        <View style={styles.bottom}>
          <Text style={styles.toggleLabel}>
            {on ? 'press button to turn off' : 'press button to turn on'}
          </Text>

          <Pressable
            onPress={toggle}
            style={({ pressed }) => [
              styles.powerBtn,
              {
                backgroundColor: on ? '#1E3A8A' : '#8F8E8E', // ON blue, OFF gray
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Text style={styles.powerGlyph}>⏻</Text>
          </Pressable>

          <View style={{ alignItems: 'center', marginTop: sy(10) }}>
            <Text style={styles.statusText}>{on ? 'Connected' : 'Not connected'}</Text>
            <Text style={[styles.timerText, { opacity: on ? 1 : 0.6 }]}>
              {on ? hhmmss(elapsed) : '00:00:00'}
            </Text>
          </View>

          {/* bottom spacer so it sits off the home indicator */}
          <View style={{ height: sy(20) }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F2' },

  // Main layout: pin controls to bottom
  screen: { flex: 1, paddingHorizontal: sx(20), justifyContent: 'space-between' },

  top: {},

  bottom: {
    alignItems: 'center',
    paddingBottom: sy(12),
  },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { fontSize: fs(18), fontWeight: '700', color: '#0A0A0A' },
  subtitle: { marginTop: sy(4), fontSize: fs(16), color: '#1B2CC1', fontWeight: '500' },

  // slightly larger settings icon
  settingsIcon: { width: sx(34), height: sx(34), resizeMode: 'contain' },

  greeting: { lineHeight: fs(44) },
  hello: { fontSize: fs(40), color: '#111', fontWeight: '300' },
  name: { fontSize: fs(40), color: '#2563EB', fontWeight: '300' },

  // larger label text
  toggleLabel: {
    fontSize: fs(20),
    color: '#1B2CC1',
    marginBottom: sy(12),
    textAlign: 'center',
  },

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

  // larger status + timer
  statusText: { fontSize: fs(20), color: '#1B2CC1', textDecorationLine: 'underline' },
  timerText: { fontSize: fs(18), color: '#1B2CC1', marginTop: sy(6) },
});
