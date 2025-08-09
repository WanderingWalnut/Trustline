import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const ShieldLogo = () => (
  <Image
    source={require('../../assets/logo.png')}   // Adjust path as needed
    style={styles.logo}
    resizeMode="contain"                      // Prevent stretching
  />
);

// Header Icons Component
const HeaderIcons = () => (
  <View style={styles.headerIcons}>
    <TouchableOpacity style={styles.iconButton}>
      <View style={styles.profileIcon}>
        <View style={styles.profileHead} />
        <View style={styles.profileBody} />
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={styles.iconButton}>
      <View style={styles.settingsIcon}>
        <View style={styles.gear} />
      </View>
    </TouchableOpacity>
  </View>
);

export default function WelcomeScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    console.log('Continue pressed with phone:', phoneNumber);
    // Navigation logic will be added later
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header with icons */}
        <HeaderIcons />

        {/* Logo and App Info */}
        <View style={styles.logoSection}>
          <ShieldLogo />
          <View style={styles.appInfo}>
            <Text style={styles.appName}>Trustline</Text>
            <Text style={styles.appDescription}>Scam call protection</Text>
          </View>
        </View>

        {/* Welcome Title */}
        <Text style={styles.welcomeTitle}>Welcome</Text>

        {/* Phone Number Section */}
        <View style={styles.phoneSection}>
          <Text style={styles.phonePrompt}>Add your phone number</Text>
          <Text style={styles.phoneDescription}>
            This will help detect and{'\n'}prevent scam callers.
          </Text>

          {/* Phone Input */}
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <View style={styles.canadaFlag}>
                <View style={styles.flagRed} />
                <View style={styles.flagWhite} />
                <View style={styles.flagRed} />
              </View>
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

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logo: {
    width: 40,     // adjust size as needed
    height: 40,
  },
  
  // Header Icons
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
  },
  profileHead: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#000',
    marginBottom: 1,
  },
  profileBody: {
    width: 10,
    height: 8,
    backgroundColor: '#000',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  settingsIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    position: 'relative',
  },
  gear: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 4,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
  },

  // Logo Section
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  shield: {
    width: 48,
    height: 56,
    backgroundColor: '#1E40FF',
    borderRadius: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shieldText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  appDescription: {
    fontSize: 16,
    color: '#1E40FF',
    fontWeight: '500',
  },

  // Welcome Title
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '300',
    color: '#000',
    marginBottom: 80,
  },

  // Phone Section
  phoneSection: {
    alignItems: 'center',
    flex: 1,
  },
  phonePrompt: {
    fontSize: 18,
    color: '#1E40FF',
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  phoneDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },

  // Phone Input
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    width: width - 48,
    marginBottom: 40,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  canadaFlag: {
    width: 20,
    height: 14,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  flagRed: {
    flex: 1,
    backgroundColor: '#FF0000',
  },
  flagWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 4,
  },

  // Continue Button
  continueButton: {
    backgroundColor: '#D0D0D0',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});