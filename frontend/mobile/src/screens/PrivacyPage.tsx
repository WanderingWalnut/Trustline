// src/screens/PrivacyScreen.tsx
import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
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

const PROFILE_ICON = require('../../assets/profile.png');
const SETTINGS_ICON = require('../../assets/settings.png');
const LOGO = require('../../assets/logo.png');
const PHONE_ICON = require('../../assets/phone.png');
const CHART_ICON = require('../../assets/chart.png');
const PEOPLE_ICON = require('../../assets/people.png');
// If you have a shield icon, use it; otherwise keep logo:
const SHIELD_ICON = require('../../assets/logo.png');

type Nav = NativeStackNavigationProp<RootStackParamList, 'Privacy'>;
type Rt  = RouteProp<RootStackParamList, 'Privacy'>;

export default function PrivacyScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Rt>();
  const params = route.params; // may be undefined if user jumped here

  // If someone opens Privacy directly, bounce them to Welcome
  React.useEffect(() => {
    if (!params?.phone || !params?.firstName) {
      navigation.replace('Welcome');
    }
  }, [params, navigation]);

  const dismiss = () => Keyboard.dismiss();

  const onContinue = () => {
    dismiss();
    // TODO: persist params (AsyncStorage / Context) if you want to use later
    navigation.replace('Protection', {
      phone: phone,
      firstName: firstName,
      lastName: params?.lastName,
      caregiverFirstName: params?.caregiverFirstName,
      caregiverLastName: params?.caregiverLastName,
      caregiverPhone: params?.caregiverPhone,
    }); // enter the app; no back to Privacy
  };

  const firstName = params?.firstName ?? '';
  const lastName  = params?.lastName ? ` ${params.lastName}` : '';
  const phone     = params?.phone ?? '';

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
                <Image source={SETTINGS_ICON} style={[styles.icon, { marginLeft: sx(12) }]} />
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.title, { marginTop: sy(40) }]}>Privacy</Text>
            <Text style={styles.privacySubtitle}>We care about your privacy</Text>

            {/* Personalize safely */}
            <Text style={{ textAlign: 'left', marginTop: sy(8), color: '#444', fontSize: fs(14) }}>
              {firstName
                ? `Hi ${firstName}${lastName}! We’ll use ${phone} to notify you about suspected scam calls.`
                : 'Review and accept to continue.'}
            </Text>

            {/* Features */}
            <View style={[styles.featuresContainer, { marginTop: sy(24) }]}>
              <View style={styles.featureRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#1E3A8A' }]}>
                  <Image source={PHONE_ICON} style={styles.featureIcon} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureText}>Your phone number remains</Text>
                  <Text style={styles.featureText}>private</Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#1E3A8A' }]}>
                  <Image source={CHART_ICON} style={styles.featureIcon} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureText}>Data is collected to provide a</Text>
                  <Text style={styles.featureText}>personal experience</Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#1E3A8A' }]}>
                  <Image source={PEOPLE_ICON} style={styles.featureIcon} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureText}>Your information is never</Text>
                  <Text style={styles.featureText}>sold or shared with third</Text>
                  <Text style={styles.featureText}>parties without your consent</Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={[styles.iconContainer, { backgroundColor: '#6B7280' }]}>
                  <Image source={SHIELD_ICON} style={styles.featureIcon} />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureText}>By clicking continue, you</Text>
                  <Text style={styles.featureText}>
                    agree to the <Text style={styles.linkText}>Privacy Policy</Text>
                  </Text>
                  <Text style={styles.featureText}>
                    and <Text style={styles.linkText}>Terms of Service</Text>
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flex: 1 }} />

            {/* Continue */}
            <Pressable style={styles.continueButton} onPress={onContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>

            <View style={{ height: sy(24) }} />
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
  iconsRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: sx(20), height: sx(20), resizeMode: 'contain' },

  title: { fontSize: fs(32), fontWeight: '600', color: '#0A0A0A', textAlign: 'left' },
  privacySubtitle: { fontSize: fs(18), color: '#1B2CC1', marginTop: sy(8), textAlign: 'left' },

  featuresContainer: { gap: sy(24) },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: sx(16) },
  iconContainer: { width: sx(48), height: sx(48), borderRadius: sx(24), alignItems: 'center', justifyContent: 'center' },
  featureIcon: { width: sx(24), height: sx(24), resizeMode: 'contain', tintColor: '#fff' },
  featureTextContainer: { flex: 1, paddingTop: sy(4) },
  featureText: { fontSize: fs(16), color: '#0A0A0A', lineHeight: fs(22) },
  linkText: { color: '#1B2CC1', textDecorationLine: 'underline' },

  continueButton: {
    backgroundColor: '#1B2CC1',
    paddingVertical: sy(16),
    borderRadius: sx(25),
    alignItems: 'center',
    marginHorizontal: sx(40),
  },
  continueButtonText: { fontSize: fs(16), color: '#fff', fontWeight: '600' },
});
