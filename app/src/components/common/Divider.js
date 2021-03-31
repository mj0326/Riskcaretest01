import React from 'react';
import {View} from 'react-native';

const Divider = ({ bgColor, height, horizontalMargin, marginTop, marginBottom}) => {
    return (
        <View
            style={[
                {
                    backgroundColor: bgColor ? bgColor : '#eeeeee',
                    height: height ? height : 1,
                    marginHorizontal: horizontalMargin ? horizontalMargin : 0,
                    marginTop: marginTop ? marginTop : 0,
                    marginBottom: marginBottom ? marginBottom : 0,
                },
            ]}
        />
    );
};

export default Divider;
