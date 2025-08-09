// src/screens/NamePage.tsx
import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigations/RootNavigator';
import { sx, sy, fs } from '../utils/designScale';

const PROFILE_ICON = require('../../assets/profile.png');
const SETTINGS_ICON = require('../../assets/settings.png');
const LOGO = require('../../assets/logo.png');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Name'>;
type Rt  = RouteProp<RootStackParamList, 'Name'>;

export default function NamePage() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>(); // { phone }
  const phone = params?.phone ?? '';

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName]   = React.useState('');

  const firstRef = React.useRef<TextInput>(null);
  const lastRef  = React.useRef<TextInput>(null);

  const dismiss = () => Keyboard.dismiss();

  const goNext = () => {
    dismiss();
    if (!firstName.trim()) {
      alert('Please enter your first name');
      return;
    }
    navigation.navigate('Privacy', {
      phone,
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
    });
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View style={[styles.headerRow, { marginTop: sy(36) }]}>
              <View style={styles.brandRow}>
                <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                <View>
                  <Text style={styles.brand}>Trustline</Text>
                  <Text style={styles.subtitle}>Scam call protection</Text>
                </View>
              </View>
              <View style={styles.iconsRow}>
                <Image source={PROFILE_ICON} style={styles.icon} />
                <Image source={SETTINGS_ICON} style={[styles.icon, { marginLeft: sx(20) }]} />
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.welcome, { marginTop: sy(80) }]}>About you!</Text>
            <Text style={styles.namePrompt}>Add your first and last name</Text>
            <Text style={styles.nameDescription}>This will help us to get to know who you are.</Text>

            {/* Inputs */}
            <View style={{ marginTop: sy(40) }}>
              <TextInput
                ref={firstRef}
                style={[styles.nameInput, { marginBottom: sy(16) }]}
                placeholder="First Name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastRef.current?.focus()}   // 👉 jump to last name
              />
              <TextInput
                ref={lastRef}
                style={styles.nameInput}
                placeholder="Last Name (optional)"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={goNext}                            // 👉 dismiss + continue
              />
            </View>

            <View style={{ height: sy(120) }} />

            {/* Continue */}
            <Pressable style={styles.continueButton} onPress={goNext}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>

            <View style={{ height: sy(60) }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const INPUT_HEIGHT = sy(48);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F2' },
  content: { flexGrow: 1, paddingHorizontal: sx(20) },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: sx(10) },
  logo: { width: sx(50), height: sx(50) },
  brand: { fontSize: fs(18), fontWeight: '700', color: '#0A0A0A' },
  subtitle: { marginTop: sy(4), fontSize: fs(16), color: '#1B2CC1', fontWeight: '500' },
  iconsRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: sx(20), height: sx(20), resizeMode: 'contain' },

  welcome: { fontSize: fs(28), fontWeight: '400', color: '#0A0A0A', textAlign: 'center' },
  namePrompt: { fontSize: fs(18), color: '#1B2CC1', textAlign: 'center', marginTop: sy(10) },
  nameDescription: { fontSize: fs(16), color: '#000', textAlign: 'center', marginTop: sy(4) },

  nameInput: {
    backgroundColor: '#DADADA',
    borderRadius: INPUT_HEIGHT / 2,
    height: INPUT_HEIGHT,
    paddingHorizontal: sx(16),
    fontSize: fs(16),
    color: '#000',
  },

  continueButton: {
    alignSelf: 'center',
    backgroundColor: '#D0D0D0',
    paddingHorizontal: sx(40),
    paddingVertical: sy(12),
    borderRadius: sx(25),
  },
  continueButtonText: { fontSize: fs(16), color: '#000' },
});
