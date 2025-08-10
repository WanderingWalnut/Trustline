// src/screens/CaregiverPage.tsx
import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

import type { RootStackParamList } from '../navigations/RootNavigator';
import { sx, sy, fs } from '../utils/designScale';
import { supabase } from '../services/api';

const LOGO = require('../../assets/logo.png');
const CANADA_FLAG = require('../../assets/flag.png');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Caregiver'>;
type Rt  = RouteProp<RootStackParamList, 'Caregiver'>;

const INPUT_H = sy(48);

export default function CaregiverPage() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>(); // { phone, firstName, lastName? }

  const [cgFirst, setCgFirst] = React.useState('');
  const [cgPhone, setCgPhone] = React.useState('');

  const phoneRef = React.useRef<TextInput>(null);

  const dismiss = () => Keyboard.dismiss();

  const goNext = async () => {
    dismiss();
    const digits = cgPhone.replace(/\D/g, '');
    const caregiverPhone = digits ? `+1${digits}` : undefined;
    const caregiverName = cgFirst.trim();
    if (!caregiverName || !caregiverPhone) {
      alert('Please enter caregiver name and phone number');
      return;
    }

    // Get user info from Supabase session
    const session = supabase.auth.getSession ? await supabase.auth.getSession() : null;
    const user = session?.data?.session?.user;
    if (!user) {
      alert('User session not found');
      return;
    }

    // Insert caregiver info into care_givers table
    const { error: insertError } = await supabase
      .from('care_givers')
      .insert([{ user_id: user.id, name: caregiverName, phone_number: caregiverPhone }]);
    if (insertError) {
      alert('Error adding caregiver: ' + insertError.message);
      return;
    }

    navigation.navigate('Privacy', {
      phone: params.phone,
      firstName: params.firstName,
      lastName: params.lastName,
      caregiverFirstName: caregiverName,
      caregiverPhone,
    });
  };

  const skip = () => {
    dismiss();
    navigation.navigate('Privacy', {
      phone: params.phone,
      firstName: params.firstName,
      lastName: params.lastName,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Header (no profile/settings icons) */}
            <View style={[styles.headerRow, { marginTop: sy(36) }]}>
              <View style={styles.brandRow}>
                <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                <View>
                  <Text style={styles.brand}>Trustline</Text>
                  <Text style={styles.subtitle}>Scam call protection</Text>
                </View>
              </View>
            </View>

            {/* Title & helper */}
            <Text style={[styles.title, { marginTop: sy(60) }]}>Caregiver</Text>
            <Text style={styles.link}>Add your caregivers information</Text>
            <Text style={styles.help}>
              This helps us to know who to{'\n'}contact in time of need
            </Text>

            {/* Inputs */}
            <View style={{ marginTop: sy(24) }}>
              <TextInput
                style={[styles.input, { marginBottom: sy(12) }]}
                placeholder="First Name"
                placeholderTextColor="#999"
                value={cgFirst}
                onChangeText={setCgFirst}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
              />

              {/* Phone row */}
              <View style={styles.phoneRow}>
                <View style={styles.flagPill}>
                  <Image source={CANADA_FLAG} style={styles.flag} />
                  <Text style={styles.code}>+1</Text>
                </View>
                <TextInput
                  ref={phoneRef}
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Phone Number"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                  value={cgPhone}
                  onChangeText={setCgPhone}
                  returnKeyType="done"
                  onSubmitEditing={goNext}
                  maxLength={14}
                />
              </View>
            </View>

            <View style={{ height: sy(28) }} />

            {/* Continue */}
            <Pressable style={styles.cta} onPress={goNext}>
              <Text style={styles.ctaText}>Continue</Text>
            </Pressable>

            {/* Skip for now — bigger and a bit lower */}
            <Pressable onPress={skip} style={{ alignSelf: 'center', marginTop: sy(20) }}>
              <Text style={styles.skipText}>skip for now &gt;&gt;</Text>
            </Pressable>

            <View style={{ height: sy(32) }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F2' },
  content: { flexGrow: 1, paddingHorizontal: sx(20) },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: sx(10) },
  logo: { width: sx(50), height: sx(50) },
  brand: { fontSize: fs(18), fontWeight: '700', color: '#0A0A0A' },
  subtitle: { marginTop: sy(4), fontSize: fs(16), color: '#1B2CC1', fontWeight: '500' },

  title: { fontSize: fs(28), color: '#0A0A0A' },
  link: { fontSize: fs(18), color: '#1B2CC1', marginTop: sy(8) },
  help: { fontSize: fs(14), color: '#111', textAlign: 'center', marginTop: sy(8) },

  input: {
    backgroundColor: '#DADADA',
    borderRadius: INPUT_H / 2,
    height: INPUT_H,
    paddingHorizontal: sx(16),
    fontSize: fs(16),
    color: '#000',
  },

  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: sx(10) },
  flagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: INPUT_H,
    borderRadius: INPUT_H / 2,
    paddingHorizontal: sx(10),
  },
  flag: { width: sx(22), height: sy(16), borderRadius: 2, marginRight: sx(6) },
  code: { fontSize: fs(14), color: '#444' },

  cta: {
    alignSelf: 'center',
    backgroundColor: '#D0D0D0',
    paddingHorizontal: sx(40),
    paddingVertical: sy(12),
    borderRadius: sx(25),
  },
  ctaText: { fontSize: fs(16), color: '#000' },

  skipText: {
    color: '#1B2CC1',
    fontSize: fs(16),        // bigger
    fontWeight: '600',       // bolder
    textDecorationLine: 'none',
  },
});

