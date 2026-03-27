import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
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
import { goBack, navigate, routesConstants } from "../../navigation";
import LottieView from "lottie-react-native";
import { animations } from "../../animations/animations";
import { Controller, useForm } from "react-hook-form";
import { DataManager } from "../../helper/dataManager";
import { showCustomMessage } from "../../helper/FlashMessage";

export const SignUp = () => {
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
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data, "SignUp Data");
    DataManager.setUserDetails({
      email: data.email,
      password: data.password,
    });
    showCustomMessage("Account created successfully. Please login.", "success");
    goBack();
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
          title={commonText.letsGetStarted}
          subtitle={commonText.yourJOurneyBegingHere}
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
            <Spacer height={scales(20)} />

            <CustomButton
              label={commonText.letsGo}
              onPress={handleSubmit(onSubmit)}
              buttonStyle={styles.button}
              labelStyle={styles.buttonLabel}
            />

            <View style={styles.signUpRow}>
              <Text style={styles.signUpBase}>
                {commonText.alreadyHaveAnAccount}
                {"? "}
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.signUpLink}>{commonText.login}</Text>
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
