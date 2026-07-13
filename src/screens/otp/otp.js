import React, { useRef, useEffect } from "react";
import { View, Platform } from "react-native";
import { AppBackground, CustomInput, CustomButton, CustomBottomSheet, Spacer } from "../../components";
import { commonText, scales, validationConstants } from "../../utils";
import { appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { authStyles as s } from "../auth/authStyles";

export const OTP = () => {
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => bottomSheetRef.current?.present(), 100);
    return () => clearTimeout(t);
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { otp: "" },
  });

  const onSubmit = () => navigate(routesConstants.ResetPassword);

  return (
    <AppBackground showAuthAnimation>
      <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={["50%"]}
          enablePanDownToClose={false}
          title={commonText.almostThere}
          subtitle={commonText.codeSentDescription}
        >
          <View style={s.form}>
            <Controller
              control={control}
              name="otp"
              rules={{
                required: validationConstants.otpRequired,
                minLength: { value: 4, message: validationConstants.invalidOtp },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Verification Code"
                  placeholder="Enter 4-digit code"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  icon={appImages.lock}
                  isBottomSheet
                  errors={errors.otp}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              )}
            />
            <CustomButton label={commonText.continue} onPress={handleSubmit(onSubmit)} buttonStyle={s.button} labelStyle={s.buttonLabel} />
          </View>
        </CustomBottomSheet>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};
