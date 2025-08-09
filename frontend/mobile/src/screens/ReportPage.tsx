import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { sx, sy, fs } from '../utils/designScale';

const LOGO = require('../../assets/logo.png');

export default function HelpCenterScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back Button */}
        <Pressable 
          style={[styles.backButton, { marginTop: sy(36) }]} 
          onPress={() => console.log('Back to settings')}
        >
          <Text style={styles.backText}>{'< back to settings'}</Text>
        </Pressable>

        {/* Logo */}
        <View style={[styles.logoSection, { marginTop: sy(60) }]}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { marginTop: sy(40) }]}>Report a Problem</Text>

        {/* Description */}
        <Text style={[styles.description, { marginTop: sy(30) }]}>
          If you have any further questions or issues, please contact the number
        </Text>

        {/* Phone Number */}
        <Pressable 
          style={[styles.phoneSection, { marginTop: sy(30) }]}
          onPress={() => console.log('Call help number')}
        >
          <Text style={styles.phoneNumber}>+1-800-HELP (4357)</Text>
        </Pressable>

        <View style={{ height: sy(40) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
    width: sx(80),
    height: sx(80),
  },
  // Title
  title: {
    fontSize: fs(32),
    fontWeight: '600',
    color: '#0A0A0A',
    textAlign: 'left',
  },
  // Description
  description: {
    fontSize: fs(18),
    color: '#0A0A0A',
    lineHeight: fs(24),
    fontWeight: '400',
    textAlign: 'left',
  },
  // Phone Section
  phoneSection: {
    alignSelf: 'flex-start',
  },
  phoneNumber: {
    fontSize: fs(18),
    color: '#1B2CC1',
    fontWeight: '500',
  },
});