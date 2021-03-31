import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {WheelPicker} from "react-native-wheel-picker-android";


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

            {  is12 &&
                <View style={styles.pickerContainer}>
                    <WheelPicker
                        itemStyle={{
                            backgroundColor: 'transparent',
                            color: '#EEEEEE',
                            fontSize: 15,
                        }}
                        selectedItemTextSize={15}
                        itemTextSize={15}
                        selectedItemTextColor={'black'}
                        indicatorColor={'#999999'}
                        selectedItem={0}
                        data={['오전', '오후']}
                        onItemSelected={() => console.log('selected')}/>
                </View>
            }

            <View style={styles.pickerContainer}>
                <WheelPicker
                    itemStyle={{
                        backgroundColor: 'transparent',
                        color: '#EEEEEE',
                        fontSize: 15,
                    }}
                    selectedItemTextSize={15}
                    itemTextSize={15}
                    selectedItemTextColor={'black'}
                    indicatorColor={'#999999'}
                    selectedItem={0}
                    data={is12 ? hour_12 : hour_24}
                    isCyclic={true}
                    hideIndicator={true}
                    onItemSelected={() => console.log('selected')} />
            </View>

            <View style={{position: 'relative', top: -20, flex: 0.25}}><Text style={{fontSize: 15,}}>:</Text></View>

            <View style={styles.pickerContainer}>
                <WheelPicker
                    itemStyle={{
                        backgroundColor: 'transparent',
                        color: '#EEEEEE',
                        fontSize: 12,
                    }}
                    selectedItemTextSize={15}
                    itemTextSize={15}
                    selectedItemTextColor={'black'}
                    indicatorColor={'#999999'}
                    selectedItem={0}
                    data={min}
                    isCyclic={true}
                    onItemSelected={() => console.log('selected')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
    },
    pickerContainer: {
        flex: 3,
        alignItems: 'center',
    },
})

export default WheelTimePicker;
