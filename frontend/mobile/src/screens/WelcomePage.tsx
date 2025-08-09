// src/screens/WelcomeScreen.tsx
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
  InputAccessoryView,
} from 'react-native';
import { sx, sy, fs } from '../utils/designScale';
import type { RootStackParamList } from '../navigations/RootNavigator';

const PROFILE_ICON = require('../../assets/profile.png');
const SETTINGS_ICON = require('../../assets/settings.png');
const LOGO = require('../../assets/logo.png');
const CANADA_FLAG = require('../../assets/flag.png');

const ACCESSORY_ID = 'phoneDone';

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Welcome'>>();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);

  const dismiss = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  // CHANGES: normalize, validate, then navigate with params
  const goNext = () => {
    dismiss();
    const digits = phoneNumber.replace(/\D/g, ''); // keep only 0-9
    if (digits.length !== 10) {
      alert('Please enter a 10-digit phone number');
      return;
    }
    const phone = `+1${digits}`; // E.164 style for Canada/US
    navigation.navigate('Name', { phone });
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
            </View>

            {/* Welcome Text */}
            <Text style={[styles.welcome, { marginTop: sy(80) }]}>Welcome</Text>
            <Text style={styles.phonePrompt}>Add your phone number</Text>
            <Text style={styles.phoneDescription}>
              This will help send notifications to alert you about scam calls.
            </Text>

            {/* Phone Input */}
            <View style={[styles.phoneInputContainer, { marginTop: sy(40) }]}>
              <Image source={CANADA_FLAG} style={styles.flag} />
              <Text style={styles.countryCode}>+1</Text>
              <TextInput
                ref={inputRef}
                style={styles.phoneInput}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={goNext}               // allow pressing return to continue
                inputAccessoryViewID={Platform.OS === 'ios' ? ACCESSORY_ID : undefined}
                maxLength={14}                          // allows spaces/dashes as user types
              />
            </View>

            <View style={{ height: sy(120) }} />

            {/* Continue Button */}
            <Pressable style={styles.continueButton} onPress={goNext}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>

            <View style={{ height: sy(60) }} />
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* iOS "Done" bar above keyboard */}
        {Platform.OS === 'ios' && (
          <InputAccessoryView nativeID={ACCESSORY_ID}>
            <View style={{ alignItems: 'flex-end', padding: 8, backgroundColor: '#EFEFEF' }}>
              <Pressable onPress={goNext} hitSlop={8}>
                <Text style={{ fontWeight: '600' }}>Done</Text>
              </Pressable>
            </View>
          </InputAccessoryView>
        )}
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
  phonePrompt: { fontSize: fs(18), color: '#1B2CC1', textAlign: 'center', marginTop: sy(10) },
  phoneDescription: { fontSize: fs(16), color: '#000', textAlign: 'center', marginTop: sy(4) },

  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DADADA',
    borderRadius: INPUT_HEIGHT / 2,
    height: INPUT_HEIGHT,
    paddingHorizontal: sx(12),
  },
  flag: { width: sx(28), height: sy(20), marginRight: sx(8), borderRadius: 3, resizeMode: 'cover' },
  countryCode: { fontSize: fs(16), color: '#000', marginRight: sx(8) },
  phoneInput: { flex: 1, fontSize: fs(16), color: '#000', paddingVertical: 0 },

  continueButton: {
    alignSelf: 'center',
    backgroundColor: '#D0D0D0',
    paddingHorizontal: sx(40),
    paddingVertical: sy(12),
    borderRadius: sx(25),
  },
  continueButtonText: { fontSize: fs(16), color: '#000' },
});
