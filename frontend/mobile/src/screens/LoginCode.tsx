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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import colors from '../constants/color';
import { sx, sy, fs } from '../utils/designScale';

const LOGO = require('../../assets/logo.png');

export default function LoginCodeScreen({ onSubmit }: { onSubmit?: (code: string) => void }) {
  const [digits, setDigits] = React.useState<string[]>(['', '', '', '', '', '']);
  const inputs = React.useRef<Array<TextInput | null>>([]);

  const code = digits.join('');
  const isReady = code.length === 6;

  const focusNext = (index: number) => {
    if (index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (index > 0) inputs.current[index - 1]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    const onlyNums = text.replace(/\D/g, '');

    // Support pasting multiple digits at once
    if (onlyNums.length > 1) {
      const next = onlyNums.slice(0, 6).split('');
      const merged = Array.from({ length: 6 }, (_, i) => next[i] ?? digits[i]);
      setDigits(merged);
      const last = Math.min(merged.findLastIndex(v => v !== '') + 1, 5);
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
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

          {/* Title + Helper (lowered) */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Already a user?</Text>
            <View style={styles.helperWrap}>
              <Text style={styles.helperStrong}>Enter in your 6 digit code</Text>
              <Text style={styles.helperSub}>
                This will help verify your{'\n'}identity
              </Text>
            </View>
          </View>

          {/* OTP Inputs */}
          <View style={styles.otpRow}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
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
                returnKeyType={i === 5 ? 'done' : 'next'}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                importantForAutofill="no"
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
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const EBG = '#eee9ec';
const BLUE = '#2438d8';
const DARK = '#0e0e0e';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: EBG,
  },
  container: {
    flex: 1,
    paddingHorizontal: sx ? sx(20) : 20,
    paddingTop: sy ? sy(12) : 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sy ? sy(40) : 40,
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
  titleBlock: {
    marginBottom: sy ? sy(30) : 30,
    alignItems: 'center',
  },
  title: {
    fontSize: fs ? fs(28) : 28,
    fontWeight: '700',
    color: DARK,
    marginBottom: sy ? sy(20) : 20,
  },
  helperWrap: {
    alignItems: 'center',
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
    paddingHorizontal: sx ? sx(10) : 10,
    marginTop: sy ? sy(8) : 8,
    marginBottom: sy ? sy(28) : 28,
  },
  otpBox: {
    width: sx ? sx(48) : 48,
    height: sy ? sy(56) : 56,
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
