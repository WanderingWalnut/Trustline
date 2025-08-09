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
        <Pressable style={[styles.backButton, { marginTop: sy(36) }]} onPress={() => console.log('Back to settings')}>
          <Text style={styles.backText}>← back to settings</Text>
        </Pressable>

        {/* Logo and Title */}
        <View style={[styles.logoTitleSection, { marginTop: sy(20) }]}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Help Center</Text>
        </View>

        {/* FAQ Section */}
        <View style={[styles.faqContainer, { marginTop: sy(30) }]}>
          
          {/* Question 1 */}
          <View style={styles.questionSection}>
            <Text style={styles.question}>Does the app require internet to work?</Text>
            <Text style={styles.answer}>Not at all. It directly uses SMS to send notifications.</Text>
          </View>

          {/* Question 2 */}
          <View style={styles.questionSection}>
            <Text style={styles.question}>Will the app warn me right away if it's suspicious?</Text>
            <Text style={styles.answer}>Yes you will receive an SMS if it is suspicious with next steps.</Text>
          </View>

          {/* Question 3 */}
          <View style={styles.questionSection}>
            <Text style={styles.question}>How does the app keep my voice and information safe?</Text>
            <Text style={styles.answer}>Our app uses a high level privacy to protect users information and data.</Text>
          </View>

          {/* Question 4 */}
          <View style={styles.questionSection}>
            <Text style={styles.question}>Does it block scam calls?</Text>
            <Text style={styles.answer}>It does not but it will send a notification to end the call or block the caller.</Text>
          </View>

        </View>

        {/* Report Problem */}
        <Pressable style={[styles.reportSection, { marginTop: sy(40) }]} onPress={() => console.log('Report a problem')}>
          <Text style={styles.reportText}>Need help? Report a problem</Text>
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

  // Logo and Title
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

  // Title
  title: { 
    fontSize: fs(32), 
    fontWeight: '600', 
    color: '#0A0A0A', 
  },

  // FAQ
  faqContainer: {
    gap: sy(24),
  },
  questionSection: {
    gap: sy(8),
  },
  question: {
    fontSize: fs(18),
    color: '#1B2CC1',
    fontWeight: '500',
    lineHeight: fs(24),
  },
  answer: {
    fontSize: fs(16),
    color: '#0A0A0A',
    lineHeight: fs(22),
    fontWeight: '400',
  },

  // Report Problem
  reportSection: {
    alignItems: 'center',
  },
  reportText: {
    fontSize: fs(18),
    color: '#1B2CC1',
    fontWeight: '500',
    textAlign: 'center',
  },
});