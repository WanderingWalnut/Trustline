import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { sx, sy, fs } from '../utils/designScale';
import type { RootStackParamList } from '../navigations/RootNavigator';

type Nav = StackNavigationProp<RootStackParamList, 'Profile'>;

const LOGO = require('../../assets/logo.png');
const CANADA_FLAG = require('../../assets/flag.png');

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  
  const [caregiverFirstName, setCaregiverFirstName] = React.useState('');
  const [caregiverLastName, setCaregiverLastName] = React.useState('');
  const [caregiverPhoneNumber, setCaregiverPhoneNumber] = React.useState('');

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back Button */}
        <Pressable style={[styles.backButton, { marginTop: sy(36) }]} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.backText}>← back to settings</Text>
        </Pressable>

        {/* Logo */}
        <View style={[styles.logoSection, { marginTop: sy(20) }]}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Profile Title */}
        <Text style={[styles.title, { marginTop: sy(30) }]}>Profile</Text>

        {/* Personal Info Section */}
        <View style={[styles.section, { marginTop: sy(30) }]}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.halfInput}
              placeholder="First Name"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.halfInput}
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Phone Input with Flag */}
          <View style={[styles.phoneInputContainer, { marginTop: sy(16) }]}>
            <View style={styles.countrySection}>
              <Image source={CANADA_FLAG} style={styles.flag} />
              <Text style={styles.countryCode}>+1</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <Pressable style={[styles.updateButton, { marginTop: sy(20) }]} onPress={() => console.log('Update personal info')}>
            <Text style={styles.updateButtonText}>update personal info</Text>
          </Pressable>
        </View>

        {/* Caregiver Info Section */}
        <View style={[styles.section, { marginTop: sy(30) }]}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.halfInput}
              placeholder="First Name"
              placeholderTextColor="#999"
              value={caregiverFirstName}
              onChangeText={setCaregiverFirstName}
            />
            <TextInput
              style={styles.halfInput}
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={caregiverLastName}
              onChangeText={setCaregiverLastName}
            />
          </View>

          {/* Caregiver Phone Input with Flag */}
          <View style={[styles.phoneInputContainer, { marginTop: sy(16) }]}>
            <View style={styles.countrySection}>
              <Image source={CANADA_FLAG} style={styles.flag} />
              <Text style={styles.countryCode}>+1</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={caregiverPhoneNumber}
              onChangeText={setCaregiverPhoneNumber}
            />
          </View>

          <Pressable style={[styles.updateButton, { marginTop: sy(20) }]} onPress={() => console.log('Update caregiver info')}>
            <Text style={styles.updateButtonText}>update caregiver info</Text>
          </Pressable>
        </View>

        <View style={{ height: sy(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const INPUT_HEIGHT = sy(48);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: sx(20),
  },

  // Back Button
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: fs(16),
    color: '#1B2CC1',
    fontWeight: '400',
  },

  // Logo
  logoSection: {
    alignItems: 'center',
  },
  logo: { 
    width: sx(60), 
    height: sx(60) 
  },

  // Profile Title
  title: { 
    fontSize: fs(32), 
    fontWeight: '600', 
    color: '#0A0A0A', 
    textAlign: 'center' 
  },

  // Sections
  section: {
    backgroundColor: 'transparent',
  },

  // Form
  inputRow: {
    flexDirection: 'row',
    gap: sx(12),
  },
  halfInput: {
    flex: 1,
    backgroundColor: '#DADADA',
    borderRadius: INPUT_HEIGHT / 2,
    height: INPUT_HEIGHT,
    paddingHorizontal: sx(16),
    fontSize: fs(16),
    color: '#000',
  },

  // Phone Input
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#DADADA',
    borderRadius: INPUT_HEIGHT / 2,
    height: INPUT_HEIGHT,
    alignItems: 'center',
    gap: sx(8),
  },
  countrySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: INPUT_HEIGHT / 2,
    paddingHorizontal: sx(12),
    paddingVertical: sy(8),
    marginLeft: sx(4),
    gap: sx(6),
  },
  flag: {
    width: sx(24),
    height: sy(16),
    borderRadius: 2,
    resizeMode: 'cover',
  },
  countryCode: {
    fontSize: fs(16),
    color: '#000',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    fontSize: fs(16),
    color: '#000',
    paddingHorizontal: sx(12),
    paddingVertical: 0,
  },

  // Update Button
  updateButton: {
    backgroundColor: '#1B2CC1',
    paddingVertical: sy(16),
    borderRadius: sx(25),
    alignItems: 'center',
  },
  updateButtonText: { 
    fontSize: fs(16), 
    color: '#fff',
    fontWeight: '600' 
  },
});