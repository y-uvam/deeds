import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { AppBackground, CustomInput, CustomButton, CustomBottomSheet } from "../../components";
import { commonText, validationConstants, validationSchema } from "../../utils";
import { appImages } from "../../assets";
import { reset } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { authStyles as s } from "../auth/authStyles";

export const ResetPassword = () => {
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => bottomSheetRef.current?.present(), 100);
    return () => clearTimeout(t);
  }, []);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = () => reset(routesConstants.Login);

  return (
    <AppBackground showAuthAnimation>
      <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={["60%"]}
          enablePanDownToClose={false}
          title={commonText.youAreAlmostBack}
          subtitle={commonText.justSetYOurPassword}
        >
          <View style={s.form}>
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
              <Text style={s.rowBase}>{commonText.newToVirtue} </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={s.rowLink}>{commonText.createAccount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CustomBottomSheet>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};
