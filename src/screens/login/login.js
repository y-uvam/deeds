import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  AppBackground,
  CustomInput,
  CustomButton,
  CustomBottomSheet,
  Spacer,
} from "../../components";
import {
  colors,
  commonText,
  scales,
  validationConstants,
  validationSchema,
} from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { navigate, reset } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { DataManager } from "../../helper/dataManager";
import { showCustomMessage } from "../../helper/FlashMessage";

export const Login = () => {
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
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    console.log(data, "Login Data");
    const userData = await DataManager.getUserDetails();
    console.log(userData, "userData");
    if (
      userData &&
      userData.email === data.email &&
      userData.password === data.password
    ) {
      showCustomMessage("Logged-In successfully.", "success");
      reset(routesConstants.BottomTabs);
    } else {
      showCustomMessage("Please enter valid email or password.", "danger");
    }
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
          title={commonText.welcomeMessage}
          subtitle={commonText.letstart}
        >
          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: validationConstants.emailRequired,
                pattern: {
                  value: validationSchema.email,
                  message: validationConstants.invalidEmail,
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label={commonText.email}
                  placeholder={commonText.enteremailaddress}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  icon={appImages.mail}
                  isBottomSheet={true}
                  errors={errors.email}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{
                required: validationConstants.passwordRequired,
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
            <Spacer height={10} />
            <TouchableOpacity
              style={styles.forgotRow}
              activeOpacity={0.7}
              onPress={() => {
                navigate(routesConstants.ForgotPassword);
              }}
            >
              <Text style={styles.forgotText}>{commonText.forgotPassword}</Text>
            </TouchableOpacity>
            <Spacer height={20} />

            <CustomButton
              label={commonText.letsGo}
              onPress={handleSubmit(handleLogin)}
              buttonStyle={styles.button}
              labelStyle={styles.buttonLabel}
            />

            <View style={styles.signUpRow}>
              <Text style={styles.signUpBase}>{commonText.newToVirtue} </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigate(routesConstants.SignUp);
                }}
              >
                <Text style={styles.signUpLink}>
                  {commonText.createAccount}
                </Text>
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
    alignSelf: "flex-end",
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
    backgroundColor: "#1E7BFF",
    shadowColor: "#1E7BFF",
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scales(20),
  },
  signUpBase: {
    fontSize: scales(13),
    fontFamily: fontFamily.regular,
    color: "rgba(255,255,255,0.55)",
  },
  signUpLink: {
    fontSize: scales(13),
    fontFamily: fontFamily.medium,
    color: colors.blue,
    letterSpacing: 0.2,
  },
});
