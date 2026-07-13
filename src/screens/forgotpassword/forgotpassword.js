import React, { useRef, useEffect } from "react";
import { View, Platform } from "react-native";
import { AppBackground, CustomInput, CustomButton, CustomBottomSheet } from "../../components";
import { commonText, validationConstants, validationSchema } from "../../utils";
import { appImages } from "../../assets";
import { navigate } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { authStyles as s } from "../auth/authStyles";

export const Forgotpassword = () => {
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => bottomSheetRef.current?.present(), 100);
    return () => clearTimeout(t);
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = () => navigate(routesConstants.OTP);

  return (
    <AppBackground showAuthAnimation>
      <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={["50%"]}
          enablePanDownToClose={false}
          title={commonText.letsFixThis}
          subtitle={commonText.dontStress}
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
            <CustomButton label={commonText.continue} onPress={handleSubmit(onSubmit)} buttonStyle={s.button} labelStyle={s.buttonLabel} />
          </View>
        </CustomBottomSheet>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};
