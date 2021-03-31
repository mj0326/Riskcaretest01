import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {PickerIOS} from "@react-native-community/picker";

const WheelTimePicker = ({ is12 }) => {
    const hour_12 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const hour_24 = [
        '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
        '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
        '21', '22', '23', '24'];
    const min = [
        '00', '01', '02', '03', '04', '05', '06', '07', '08', '09',
        '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
        '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
        '40', '41', '44', '44', '44', '45', '46', '47', '48', '49',
        '50', '51', '55', '55', '55', '55', '56', '57', '58', '59'];

    return (
        <View style={styles.container}>

            { is12 &&
                <PickerIOS
                    style={styles.pickerContainer}
                    onValueChange={() => console.log('selected...')}
                    selectedValue={'오전'}>
                    {
                        ['오전', '오후'].map((minVal, i) => {
                            console.log('==== item', minVal, i);
                            return (
                                <PickerIOS.Item
                                    key={i}
                                    value={minVal}
                                    label={minVal}
                                ></PickerIOS.Item>)
                        })
                    }
                </PickerIOS>
            }

            <PickerIOS
                style={styles.pickerContainer}
                onValueChange={() => console.log('selected...')}
                selectedValue={'오전'}>
                {
                    (is12 ? hour_12 : hour_24).map((minVal, i) => {
                        console.log('==== item', minVal, i);
                        return (
                            <PickerIOS.Item
                                key={i}
                                value={minVal}
                                label={minVal}
                            ></PickerIOS.Item>)
                    })
                }
            </PickerIOS>

            <View style={{position: 'relative', top: '25%', flex: 0.25, fontSize: 15}}><Text style={{ textAlign: 'center' }}>:</Text></View>

            <PickerIOS
                style={styles.pickerContainer}
                onValueChange={() => console.log('selected...')}
                selectedValue={'오전'}>
                {
                    min.map((minVal, i) => {
                        console.log('==== item', minVal, i);
                        return (
                            <PickerIOS.Item
                                key={i}
                                value={minVal}
                                label={minVal}
                            ></PickerIOS.Item>)
                    })
                }
            </PickerIOS>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    pickerContainer: {
        flex: 1
    },
})

export default WheelTimePicker;
