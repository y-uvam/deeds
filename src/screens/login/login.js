import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Image } from "react-native";
import {
  AppBackground,
  CustomInput,
  CustomButton,
  CustomBottomSheet,
  Spacer,
} from "../../components";
import {
  commonText,
  scales,
  validationConstants,
  validationSchema,
} from "../../utils";
import { fontFamily, appImages } from "../../assets";
import { navigate, reset } from "../../navigation/navigationServices";
import { routesConstants } from "../../navigation/routeConstants";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { DataManager } from "../../helper/dataManager";
import { showCustomMessage } from "../../helper/FlashMessage";
import { authStyles as s } from "../auth/authStyles";

export const Login = () => {
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => bottomSheetRef.current?.present(), 100);
    return () => clearTimeout(t);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (data) => {
    showCustomMessage("Logged-In successfully.", "success");
    reset(routesConstants.BottomTabs);
  };

  return (
    <AppBackground showAuthAnimation>
      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.logoArea}>
          <Image
            source={appImages.appLogo}
            style={s.logo}
            resizeMode="contain"
          />
        </View>
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={["55%"]}
          enablePanDownToClose={false}
          title={commonText.welcomeMessage}
          subtitle={commonText.letstart}
        >
          <View style={s.form}></View>
        </CustomBottomSheet>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};
