import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./navigationServices";
import MainStack from "./mainStack";
import { routesConstants } from "./routeConstants";

const linking = {
  prefixes: ["sinema://", "https://sinema.app", "https://*.sinema.app"],
  config: {
    screens: {
      [routesConstants.Home]: "",
      [routesConstants.post]: "post/:id",
      [routesConstants.Profile]: "profile/:username",
    },
  },
};

const Routes = () => {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <MainStack />
    </NavigationContainer>
  );
};

export default Routes;
