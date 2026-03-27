import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { AppBackground, CustomInput, CustomButton, CustomBottomSheet } from '../../components';
import { colors, commonText, scales } from '../../utils';
import { fontFamily, appImages } from '../../assets';
import { navigate, reset, routesConstants } from "../../navigation";
import LottieView from 'lottie-react-native';
import { animations } from '../../animations/animations';

import { Controller, useForm } from "react-hook-form";
import { validationConstants, validationSchema } from "../../utils";

export const ResetPassword = () => {
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => bottomSheetRef.current?.present(), 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data, "Reset Password Data");
    reset(routesConstants.Login);
  };

  return (
    <AppBackground>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <LottieView
          source={animations.auth}
          autoPlay
          loop={true}
          style={{ width: "50%", height: "50%", alignSelf: "center" }}
        />
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={["55%"]}
          enablePanDownToClose={false}
          title={commonText.youAreAlmostBack}
          subtitle={commonText.justSetYOurPassword}
        >
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="password"
              rules={{
                required: validationConstants.passwordRequired,
                pattern: {
                  value: validationSchema.password,
                  message: validationConstants.invalidPassword,
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label={commonText.password}
                  placeholder={commonText.enterpassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  icon={appImages.lock}
                  isBottomSheet={true}
                  errors={errors.password}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: validationConstants.enterconfirmPassword,
                validate: (val) => {
                  if (watch("password") != val) {
                    return validationConstants.passwordNotMatch;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label={commonText.confirmPassword}
                  placeholder={commonText.enterConfirmPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  icon={appImages.lock}
                  isBottomSheet={true}
                  errors={errors.confirmPassword}
                />
              )}
            />

            <CustomButton
              label={commonText.letsGo}
              onPress={handleSubmit(onSubmit)}
              buttonStyle={styles.button}
              labelStyle={styles.buttonLabel}
            />

            <View style={styles.signUpRow}>
              <Text style={styles.signUpBase}>{commonText.newToVirtue} </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.signUpLink}>{commonText.createAccount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomBottomSheet>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
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
  button: {
    borderRadius: 14,
    paddingVertical: scales(17),
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
