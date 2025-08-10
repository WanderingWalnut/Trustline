// src/screens/Settings.tsx
import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { sx, sy, fs } from '../utils/designScale';
import type { RootStackParamList } from '../navigations/RootNavigator';

type Nav = StackNavigationProp<RootStackParamList, 'Settings'>;

const PROFILE_ICON = require('../../assets/profile.png');

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.headerRow, { marginTop: sy(36) }]}>
          <View>
            <Text style={styles.brand}>Trustline</Text>
            <Text style={styles.subtitle}>Scam call protection</Text>
          </View>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeButton}>✕</Text>
          </Pressable>
        </View>

        {/* Settings Title */}
        <Text style={[styles.title, { marginTop: sy(40) }]}>Settings</Text>

        {/* Edit Profile */}
        <Pressable
          style={[styles.profileSection, { marginTop: sy(40) }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.profileRow}>
            <View style={styles.profileIconContainer}>
              <Image source={PROFILE_ICON} style={styles.profileIcon} />
            </View>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </View>
        </Pressable>

        {/* Settings Options */}
        <View style={[styles.settingsContainer, { marginTop: sy(30) }]}>

          {/* Notifications */}
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#1B2CC1' }}
              thumbColor={'#fff'}
            />
          </View>
          <View style={styles.separator} />

          {/* Privacy Statement */}
          <Pressable style={styles.settingRow} onPress={() => console.log('Privacy Statement')}>
            <Text style={styles.settingText}>Privacy Statement</Text>
          </Pressable>
          <View style={styles.separator} />

          {/* Help Center */}
          <Pressable style={styles.settingRow} onPress={() => console.log('Help Center')}>
            <Text style={styles.settingText}>Help Center</Text>
          </Pressable>
          <View style={styles.separator} />

          {/* Report Problem */}
          <Pressable style={styles.settingRow} onPress={() => console.log('Report Problem')}>
            <Text style={styles.settingText}>Report Problem</Text>
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.logoutButton} onPress={() => console.log('Log out')}>
            <Text style={styles.logoutButtonText}>log out</Text>
          </Pressable>

          <Pressable style={styles.deactivateButton} onPress={() => console.log('Deactivate account')}>
            <Text style={styles.deactivateButtonText}>deactivate account</Text>
          </Pressable>
        </View>

        <View style={{ height: sy(40) }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  content: {
    flex: 1,
    paddingHorizontal: sx(20),
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: { fontSize: fs(18), fontWeight: '700', color: '#0A0A0A' },
  subtitle: { marginTop: sy(4), fontSize: fs(16), color: '#1B2CC1', fontWeight: '500' },
  closeButton: { fontSize: fs(24), color: '#1B2CC1', fontWeight: '300' },

  // Settings Title
  title: { fontSize: fs(32), fontWeight: '600', color: '#0A0A0A', textAlign: 'left' },

  // Profile Section
  profileSection: {
    backgroundColor: '#DADADA',
    borderRadius: sx(25),
    paddingHorizontal: sx(20),
    paddingVertical: sy(16),
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sx(16),
  },
  profileIconContainer: {
    width: sx(40),
    height: sx(40),
    borderRadius: sx(20),
    backgroundColor: '#1B2CC1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: sx(20),
    height: sx(20),
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  editProfileText: {
    fontSize: fs(18),
    color: '#1B2CC1',
    fontWeight: '500',
  },

  // Settings Container
  settingsContainer: {
    backgroundColor: '#DADADA',
    borderRadius: sx(25),
    paddingHorizontal: sx(20),
    paddingVertical: sy(8),
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sy(16),
  },
  settingText: {
    fontSize: fs(18),
    color: '#1B2CC1',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#B0B0B0',
    marginHorizontal: sx(-20),
  },

  // Action Buttons
  actionButtons: {
    gap: sy(16),
  },
  logoutButton: {
    backgroundColor: '#1B2CC1',
    paddingVertical: sy(16),
    borderRadius: sx(25),
    alignItems: 'center',
  },
  logoutButtonText: { fontSize: fs(16), color: '#fff', fontWeight: '600' },
  deactivateButton: {
    backgroundColor: '#1B2CC1',
    paddingVertical: sy(16),
    borderRadius: sx(25),
    alignItems: 'center',
  },
  deactivateButtonText: { fontSize: fs(16), color: '#fff', fontWeight: '600' },
});
