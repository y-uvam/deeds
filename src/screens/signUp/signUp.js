import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { AppBackground, CustomInput, CustomButton, CustomBottomSheet, Spacer } from "../../components";
import { commonText, scales, validationConstants, validationSchema } from "../../utils";
import { appImages } from "../../assets";
import { goBack, navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { DataManager } from "../../helper/dataManager";
import { showCustomMessage } from "../../helper/FlashMessage";
import { authStyles as s } from "../auth/authStyles";

export const SignUp = () => {
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => bottomSheetRef.current?.present(), 100);
    return () => clearTimeout(t);
  }, []);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (data) => {
    DataManager.setUserDetails({ email: data.email, password: data.password });
    showCustomMessage("Account created successfully. Please login.", "success");
    goBack();
  };

  return (
    <AppBackground showAuthAnimation>
      <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={["65%"]}
          enablePanDownToClose={false}
          title={commonText.letsGetStarted}
          subtitle={commonText.yourJOurneyBegingHere}
        >
          <View style={s.form}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: validationConstants.emailRequired,
                pattern: { value: validationSchema.email, message: validationConstants.invalidEmail },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label={commonText.email}
                  placeholder={commonText.enteremailaddress}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  icon={appImages.mail}
                  isBottomSheet
                  errors={errors.email}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{
                required: validationConstants.passwordRequired,
                pattern: { value: validationSchema.password, message: validationConstants.invalidPassword },
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
                  isBottomSheet
                  errors={errors.password}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: validationConstants.enterconfirmPassword,
                validate: (val) => watch("password") === val || validationConstants.passwordNotMatch,
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
                  isBottomSheet
                  errors={errors.confirmPassword}
                />
              )}
            />
            <CustomButton label={commonText.letsGo} onPress={handleSubmit(onSubmit)} buttonStyle={s.button} labelStyle={s.buttonLabel} />
            <View style={s.row}>
              <Text style={s.rowBase}>{commonText.alreadyHaveAnAccount}? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigate(routesConstants.Login)}>
                <Text style={s.rowLink}>{commonText.login}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomBottomSheet>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};
