import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {colors, scales} from '../../utils';
import {appImages, fontFamily} from '../../assets';

export const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword,
  height,
  isEditable = true, // default is editable
  multiline=false,
  paddingTop
}) => {
  const [secureText, setSecureText] = useState(isPassword);

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Input Field with Password Toggle */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, {height: height || 45,    textAlignVertical : multiline? 'top': 'center',
            paddingTop: paddingTop ?  10 : 0
          }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.lightGray}
          secureTextEntry={secureText}
          autoCapitalize="none"
          scrollEnabled={false}
          multiline={multiline}
          // numberOfLines={1}
          editable={isEditable}
        />

        {/* Show/Hide Password Button */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            style={styles.eyeIcon}>
            <Image
              source={secureText ? appImages.eyeclose : appImages.eyeopen}
              style={styles.eyeImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  label: {
    fontSize: scales(16),
    color: colors.black,
    fontFamily: fontFamily.medium,
    marginBottom: 6,
    fontWeight: '500',
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: scales(16),
    width: '100%',
    flexShrink: 1,
    color: colors.black,
    fontFamily: fontFamily.regular,
    marginLeft: Platform.OS === 'ios' ? 0 : -4,
    includeFontPadding: false,
    paddingVertical: 0,
    borderWidth: 0.9,
    borderRadius: 8,
    borderColor: colors.borderColor,
    paddingRight: 40,
    padding: 20,
    marginLeft: 7,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
  },
  eyeImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
});
