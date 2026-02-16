import * as React from 'react';
//NAVIGATION ACTION
import {CommonActions, StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

let navigator;

export const navigate = (path, params = null) => {
  navigationRef.current.navigate(path, params);
};

export const goBack = () => {
  navigationRef.current.goBack();
};

export const reset = (name, index, data = null) => {
  navigationRef?.current?.dispatch(
    CommonActions.reset({
      index: index,
      routes: [
        {
          name: name,
          params: data,
        },
      ],
    }),
  );
};

export const push = (...args) => {
  navigationRef.current?.dispatch(StackActions.push(...args));
};

export const replace = (name, data = null) => {
  navigationRef.current?.dispatch(StackActions.replace(name, data));
};

export const setNavigator = nav => {
  navigator = nav;
};

export const getCurrentRoute = () => {
  const route = navigationRef.current?.getCurrentRoute();
  return route.name;
};
