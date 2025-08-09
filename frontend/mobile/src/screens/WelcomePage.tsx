import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigations/RootNavigator';

const { width } = Dimensions.get('window');

// Adjust logo size proportionally to screen width
const LOGO_W = Math.round(width * 0.14);

type Nav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation<Nav>();

  // Auto-redirect after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Protection'); // replace prevents going back to Welcome
    }, 3000);
    return () => clearTimeout(t);
  }, [navigation]);

  const handleContinue = () => {
    navigation.navigate('Protection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top row: Brand on left, icons on right */}
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.appName}>Trustline</Text>
              <Text style={styles.appDescription}>Scam call protection</Text>
            </View>
          </View>

          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require('../../assets/profile.png')}
                style={styles.iconImg}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Image
                source={require('../../assets/settings.png')}
                style={styles.iconImg}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome */}
        <Text style={styles.welcomeTitle}>Welcome</Text>

        {/* Phone number section */}
        <View style={styles.phoneSection}>
          <Text style={styles.phonePrompt}>Add your phone number</Text>
          <Text style={styles.phoneDescription}>
            This will help detect and{'\n'}prevent scam callers.
          </Text>

          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Image
                source={require('../../assets/canada.png')} // replace with your flag asset
                style={styles.flagImg}
                resizeMode="cover"
              />
              <Text style={styles.countryCodeText}>+1</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 12 },

  // Header
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: LOGO_W,
    height: LOGO_W,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  appDescription: {
    fontSize: 16,
    color: '#1E40FF',
    fontWeight: '500',
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  iconImg: { width: 22, height: 22 },

  // Title
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '300',
    color: '#000',
    marginTop: 8,
    marginBottom: 64,
  },

  // Phone section
  phoneSection: { alignItems: 'center', flex: 1 },
  phonePrompt: {
    fontSize: 18,
    color: '#1E40FF',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  phoneDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    width: width - 48,
    marginBottom: 28,
  },
  countryCode: { flexDirection: 'row', alignItems: 'center', marginRight: 10, gap: 8 },
  flagImg: { width: 22, height: 16, borderRadius: 3, overflow: 'hidden' },
  countryCodeText: { fontSize: 16, color: '#666', fontWeight: '600' },
  phoneInput: { flex: 1, fontSize: 16, color: '#000', paddingVertical: 4 },

  continueButton: {
    backgroundColor: '#D0D0D0',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
  },
  continueButtonText: { fontSize: 16, color: '#666', fontWeight: '600' },
});
