import React from 'react';
import { StyleSheet, View } from "react-native";
import { Spacer } from "../spacer/spacer";

export const FooterComponent = ({ height }) => {
    return (
       <View style={style.container}>
        <Spacer height={height} />
       </View>
    );
}

const style = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'transparent'
    }
});