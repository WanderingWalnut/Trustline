// src/screens/LoginCodeScreen.tsx
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
  Platform,
} from 'react-native';

// If your project uses these, keep them. Otherwise, replace with numbers below.
import colors from '../constants/color';            // fallback: comment out and use hex in styles
import { sx, sy, fs } from '../utils/designScale';  // fallback: replace fs/sx/sy with numbers

const LOGO = require('../../assets/logo_shield_t.png'); // put your blue shield T here

export default function LoginCodeScreen({ onSubmit }: { onSubmit?: (code: string) => void }) {
  const [digits, setDigits] = React.useState<string[]>(['', '', '', '']);
  const inputs = React.useRef<Array<TextInput | null>>([]);

  const code = digits.join('');
  const isReady = code.length === 4;

  const focusNext = (index: number) => {
    if (index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };
  const focusPrev = (index: number) => {
    if (index > 0) inputs.current[index - 1]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    // Support pasting all 4 at once
    const onlyNums = text.replace(/\D/g, '');
    if (onlyNums.length > 1) {
      const next = onlyNums.slice(0, 4).split('');
      const merged = [0, 1, 2, 3].map(i => next[i] ?? digits[i]);
      setDigits(merged);
      const last = Math.min(merged.findLastIndex(v => v !== '') + 1, 3);
      inputs.current[last]?.focus();
      return;
    }

    const c = onlyNums;
    const next = [...digits];
    next[index] = c;
    setDigits(next);
    if (c) focusNext(index);
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index]) {
      focusPrev(index);
    }
  };

  const submit = () => {
    if (!isReady) return;
    onSubmit?.(code);
    // TODO: wire up navigation once you give me routing
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Brand */}
        <View style={styles.brandRow}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.brand}>Trustline</Text>
            <Text style={styles.tagline}>Scam call protection</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Already a user?</Text>

        {/* Helper */}
        <View style={styles.helperWrap}>
          <Text style={styles.helperStrong}>Enter in your 4 digit code</Text>
          <Text style={styles.helperSub}>This will help verify your{'\n'}identity</Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {[0, 1, 2, 3].map((i) => (
            <TextInput
              key={i}
              ref={r => { inputs.current[i] = r; }}
              style={[styles.otpBox, digits[i] ? styles.otpFilled : null]}
              value={digits[i]}
              onChangeText={(t) => handleChange(t, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              maxLength={1}
              returnKeyType={i === 3 ? 'done' : 'next'}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#2f3bdd"
            />
          ))}
        </View>

        {/* Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            !isReady && styles.buttonDisabled,
            pressed && isReady && styles.buttonPressed,
          ]}
          onPress={submit}
          disabled={!isReady}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const EBG = '#eee9ec';         // fallback if you don’t import colors
const BLUE = '#2438d8';
const DARK = '#0e0e0e';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: EBG, // colors?.background ?? EBG
  },
  container: {
    flex: 1,
    paddingHorizontal: sx ? sx(20) : 20,
    paddingTop: sy ? sy(12) : 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sy ? sy(20) : 20,
  },
  logo: {
    width: sx ? sx(32) : 32,
    height: sx ? sx(32) : 32,
    marginRight: sx ? sx(10) : 10,
  },
  brand: {
    fontSize: fs ? fs(14) : 14,
    fontWeight: '700',
    color: DARK,
  },
  tagline: {
    fontSize: fs ? fs(13) : 13,
    color: BLUE,
    marginTop: 2,
  },
  title: {
    fontSize: fs ? fs(28) : 28,
    fontWeight: '700',
    color: DARK,
    marginTop: sy ? sy(8) : 8,
    marginBottom: sy ? sy(40) : 40,
  },
  helperWrap: {
    alignItems: 'center',
    marginBottom: sy ? sy(18) : 18,
  },
  helperStrong: {
    fontSize: fs ? fs(16) : 16,
    color: BLUE,
    fontWeight: '600',
    marginBottom: sy ? sy(6) : 6,
  },
  helperSub: {
    fontSize: fs ? fs(12) : 12,
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: sx ? sx(18) : 18,
    marginTop: sy ? sy(8) : 8,
    marginBottom: sy ? sy(28) : 28,
  },
  otpBox: {
    width: sx ? sx(56) : 56,
    height: sx ? sx(56) : 56,
    backgroundColor: '#e2e2e5',
    borderRadius: 14,
    textAlign: 'center',
    fontSize: fs ? fs(22) : 22,
    fontWeight: '700',
  },
  otpFilled: {
    backgroundColor: '#d9d9de',
  },
  button: {
    alignSelf: 'center',
    paddingHorizontal: sx ? sx(24) : 24,
    height: sy ? sy(40) : 40,
    borderRadius: 22,
    justifyContent: 'center',
    backgroundColor: BLUE,
    minWidth: sx ? sx(120) : 120,
  },
  buttonPressed: { opacity: 0.9 },
  buttonDisabled: { backgroundColor: '#aab2ff' },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: fs ? fs(14) : 14,
    textAlign: 'center',
  },
});

