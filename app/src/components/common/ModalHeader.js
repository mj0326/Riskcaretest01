import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Images from '../../../assets';

const ModalHeader = ({headerTxt, isCenter, close}) => {

    return (
        <View style={isCenter ? styles.headerCenter : styles.headerLeft}>
            <TouchableOpacity onPress={close}>
                <Image source={Images.modalHeader.back} style={styles.imageBtn}/>
            </TouchableOpacity>
            <Text style={isCenter ? {...styles.headerTitleCenter} : {...styles.headerTitleLeft}}>{headerTxt}</Text>
        </View>
    )
};


const styles = StyleSheet.create({
    headerCenter: {
        height: 60,
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerTitleCenter: {
        color: '#222222',
        fontSize: 18,
        flex: 1,
        textAlign: 'center'
    },
    headerLeft: {
        height: 60,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerTitleLeft: {
        color: '#222222',
        fontSize: 18
    },

    imageBtn: {
        width: 24,
        height: 24
    },
});

export default ModalHeader;
