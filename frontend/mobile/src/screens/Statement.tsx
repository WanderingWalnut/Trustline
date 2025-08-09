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

export default function PrivacyStatementScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back Button */}
        <Pressable style={[styles.backButton, { marginTop: sy(36) }]} onPress={() => console.log('Back to settings')}>
          <Text style={styles.backText}>← back to settings</Text>
        </Pressable>

        {/* Logo and Title */}
        <View style={[styles.logoTitleSection, { marginTop: sy(20) }]}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Privacy Statement</Text>
        </View>

        {/* Privacy Content */}
        <View style={[styles.privacyContainer, { marginTop: sy(40) }]}>
          
          {/* Purpose of data use */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Purpose of data use</Text>
            <Text style={styles.sectionText}>Information is collected to detect and warn about scams</Text>
          </View>

          {/* Compliance Laws */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compliance Laws</Text>
            <Text style={styles.sectionText}>App follows privacy laws provided by the CCPA</Text>
          </View>

          {/* Minimal Personal Data Collection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimal Personal Data Collection</Text>
            <Text style={styles.sectionText}>Only information that will be collected will be the one used in the app</Text>
          </View>

          {/* No-third party sharing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>No-third party sharing without consent</Text>
            <Text style={styles.sectionText}>Data will not be shared with outside companies without approval.</Text>
          </View>

          {/* Updates to Privacy Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Updates to Privacy Policy</Text>
            <Text style={styles.sectionText}>Users will be notified by updates or notifications when privacy is updated</Text>
          </View>

          {/* Contact for Concerns */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact for Concerns</Text>
            <Text style={styles.sectionText}>If you have question's or concerns. visit the report a problem page or call 1-800-HELP (4357)</Text>
          </View>

        </View>

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

  // Logo and Title on same line
  logoTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sx(12),
  },
  logo: { 
    width: sx(50), 
    height: sx(50) 
  },
  title: { 
    fontSize: fs(32), 
    fontWeight: '600', 
    color: '#0A0A0A', 
  },

  // Privacy Content
  privacyContainer: {
    gap: sy(24),
  },
  section: {
    gap: sy(8),
  },
  sectionTitle: {
    fontSize: fs(18),
    color: '#1B2CC1',
    fontWeight: '600',
    lineHeight: fs(24),
  },
  sectionText: {
    fontSize: fs(16),
    color: '#0A0A0A',
    lineHeight: fs(22),
    fontWeight: '400',
  },
});