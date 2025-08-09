// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SplashScreen: undefined;
  Welcome: undefined; // match RootNavigator
  Protection: undefined;
};

export default function SplashScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SplashScreen'>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      // prevent back to splash
      navigation.replace('Welcome');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Trustline</Text>
      <Text style={styles.subtitle}>Scam call protection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { width: 257, height: 257, marginBottom: 30 },
  title: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 36,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 20,
    color: '#1B2CC1',
    textAlign: 'center',
  },
});
