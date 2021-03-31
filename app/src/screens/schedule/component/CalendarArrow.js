import React from 'react';
import {Image, View, TouchableOpacity, StyleSheet} from 'react-native';
import Images from '../../../../assets/index';

const CalendarArrow = ({direction, addMonth}) => {
    return (
        <View>
            { direction == 'left' &&
                <TouchableOpacity onPress={() => addMonth(-1)}>
                    <Image source={Images.back}></Image>
                </TouchableOpacity>
            }

            { direction == 'right' &&
                <TouchableOpacity onPress={() => addMonth(1)}>
                    <Image source={Images.back}></Image>
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({

});

export default CalendarArrow;
