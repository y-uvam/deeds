import React, {useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {appImages} from '../../assets';
import {colors} from '../../utils';

export const ImageUploader = ({width = 200, height = 200, onImageChange}) => {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || response.errorCode) {
        console.warn('Image selection cancelled or failed');
      } else {
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setImageUri(uri);
          onImageChange?.(uri); // send selected image uri to parent
        }
      }
    });
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={[styles.imageContainer, {width, height}]}>
        {imageUri ? (
          <Image
            source={{uri: imageUri}}
            style={[styles.image, {width, height}]}
          />
        ) : (
          <View style={styles.placeholder}>
            {/* <Text style={{color: '#aaa'}}>Tap to upload</Text> */}
            <Image
              source={appImages.imageupload}
              style={{width: 50, height: 50}}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
