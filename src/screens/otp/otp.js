import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { AppBackground, CustomBottomSheet, CustomButton, CustomInput, Spacer } from '../../components';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { commonText, scales } from '../../utils';
import { appImages } from '../../assets';
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import LottieView from 'lottie-react-native';
import { animations } from '../../animations/animations';

import { Controller, useForm } from "react-hook-form";
import { validationConstants } from "../../utils";

export const OTP = () => {
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => bottomSheetRef.current?.present(), 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data, "OTP Data");
    navigate(routesConstants.ResetPassword);
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
          title={commonText.almostThere}
          subtitle={commonText.codeSentDescription}
        >
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="otp"
              rules={{
                required: validationConstants.otpRequired,
                minLength: { value: 4, message: validationConstants.invalidOtp },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label={"Verification Code"}
                  placeholder={"Enter 4-digit code"}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  icon={appImages.lock}
                  isBottomSheet={true}
                  errors={errors.otp}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              )}
            />
            <CustomButton
              label={commonText.continue}
              onPress={handleSubmit(onSubmit)}
              buttonStyle={styles.button}
              labelStyle={styles.buttonLabel}
            />
          </View>
          <Spacer height={scales(40)} />
        </CustomBottomSheet>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   formContainer: {
    flex: 1,
    justifyContent:'space-between'
  },
});
