import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { AppBackground, CustomInput, GlassCard, CustomButton } from '../../components';
import { colors, scales } from '../../utils';
import { fontFamily, appImages } from '../../assets';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <GlassCard>

             <Text style={styles.title}>Welcome Back, Buddy !</Text>
            <Text style={styles.subtitle}>Let's Get You Back In</Text>

            <View style={styles.spacer} />
{/*

            <CustomInput
              label="Email Address"
              placeholder="Enter Email Address"
              value={email}
              onChangeText={setEmail}
              icon={appImages.mail}   // replace with an email icon if you add one
            />


            <CustomInput
              label="Password"
              placeholder="Enter Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              icon={appImages.lock}        // replace with a lock icon if you add one
            />

            <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <CustomButton
              label="Let's Go"
              onPress={() => {}}
              buttonStyle={styles.button}
              labelStyle={styles.buttonLabel}
            />

            <View style={styles.signUpRow}>
              <Text style={styles.signUpBase}>New To Virtue ? </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.signUpLink}>Create Account</Text>
              </TouchableOpacity>
            </View> */}
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: scales(20),
    paddingVertical: scales(40),
  },

  spacer: {
    height: scales(12),
  },

  // — Title section —
  title: {
    fontSize: scales(24),
    fontFamily: fontFamily.bold,
    color: colors.white,
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: scales(14),
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.55)',
    marginTop: scales(6),
    letterSpacing: 0.2,
  },

  // — Forgot password —
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: scales(4),
    marginBottom: scales(4),
  },

  forgotText: {
    fontSize: scales(13),
    fontFamily: fontFamily.medium,
    color: colors.blue,
    letterSpacing: 0.2,
  },

  // — Button —
  button: {
    borderRadius: 14,
    paddingVertical: scales(17),
    // Vivid blue matching the design
    backgroundColor: '#1E7BFF',
    shadowColor: '#1E7BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonLabel: {
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    letterSpacing: 0.5,
  },

  // — Sign up row —
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scales(20),
  },

  signUpBase: {
    fontSize: scales(13),
    fontFamily: fontFamily.regular,
    color: 'rgba(255,255,255,0.55)',
  },

  signUpLink: {
    fontSize: scales(13),
    fontFamily: fontFamily.medium,
    color: colors.blue,
    letterSpacing: 0.2,
  },
});
