import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppBackground, CustomBottomSheet, CustomButton, CustomInput, Spacer } from '../../components';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { commonText, scales } from '../../utils';
import { appImages } from '../../assets';
import { navigate, routesConstants } from '../../navigation';
import LottieView from 'lottie-react-native';
import { animations } from '../../animations/animations';

export const OTP = () => {
   const bottomSheetRef = useRef(null);
    const [email, setEmail] = useState('');
  
    useEffect(() => {
      const timer = setTimeout(() => bottomSheetRef.current?.present(), 100);
      return () => clearTimeout(timer);
    }, []);
 return (
     <AppBackground>
       <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <LottieView
                         source={animations.auth}
                         autoPlay
                         loop={true}
                         style={{ width: '50%', height: '50%',alignSelf:'center' }}
                       />
         <CustomBottomSheet
           ref={bottomSheetRef}
           snapPoints={['55%']}
           enablePanDownToClose={false}
           title={commonText.almostThere}
           subtitle={commonText.codeSentDescription}
         >
           <View style={styles.formContainer}>
             <CustomInput
               label={commonText.email}
               placeholder={commonText.enteremailaddress}
               value={email}
               onChangeText={setEmail}
               icon={appImages.mail}
             />
             <CustomButton
               label={commonText.continue}
               onPress={() => {navigate(routesConstants.ResetPassword)}}
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
