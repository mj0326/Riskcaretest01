import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import moment from "moment";
import {Calendar} from "react-native-calendars";

import WheelTimePicker from "../../../components/common/WheelTimePicker";
import WheelTimePickerIOS from "../../../components/common/WheelTimePickerIOS";

const EventTimeSetter = ({title, screenCtrl, setScreenCtrl}) => {
    /**
     * set 요일
     * */
    const setDay = (dayNum) => {
        const day = ['일', '월', '화', '수', '목', '금', '토'];
        return day[dayNum];
    }

    /**
     * 12 및 24 시간제 여부 체크
     * */
    const setTime = (timeNum) => {
        let timeDesc = '';

        // 12 시간제, 24시간제 체크
        // const is12 = true;
        // if(!is12) {
        //     return;
        // }

        timeDesc = timeNum < 12 ? '오전 ' : '오후 ';
        return timeDesc;
    }

    return(
        <View>
            <View style={styles.dateItemRow}>
                <Text>{title}</Text>
                <View style={styles.dateItemRow2}>
                    <TouchableOpacity
                        onPress={() => {
                            setScreenCtrl(
                                title == '시작' ?
                                    {
                                        ...screenCtrl,
                                        strDateClicked: !screenCtrl.strDateClicked,
                                        strTimeClicked: !screenCtrl.strDateClicked == true ? false : screenCtrl.strTimeClicked
                                    }
                                    :
                                    {
                                        ...screenCtrl,
                                        endDateClicked: !screenCtrl.endDateClicked,
                                        endTimeClicked: !screenCtrl.endDateClicked == true ? false : screenCtrl.endTimeClicked
                                    }
                            )
                        }}>
                        <Text>{moment().format('YYYY년 MM월 DD일')} {setDay(moment().day()) + '요일'}</Text>
                    </TouchableOpacity>
                    {!screenCtrl.isAllDay &&
                        <TouchableOpacity
                            onPress={() => setScreenCtrl(
                                title == '시작' ?
                                {
                                    ...screenCtrl,
                                    strTimeClicked: !screenCtrl.strTimeClicked,
                                    strDateClicked: !screenCtrl.strTimeClicked == true || screenCtrl.isAllDay == true ? false : screenCtrl.strDateClicked
                                }
                                :
                                {
                                    ...screenCtrl,
                                    endTimeClicked: !screenCtrl.endTimeClicked,
                                    endDateClicked: !screenCtrl.endTimeClicked == true || screenCtrl.isAllDay == true ? false : screenCtrl.endDateClicked
                                }
                            )}
                            style={{paddingLeft: 20}}>
                            <Text>
                                {setTime(moment().format('HH'))}
                                {title == '시작' ? moment().format('HH:mm') : moment().add(1, 'hours').format('HH:mm')}</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>

            {(title == '시작' ? screenCtrl.strDateClicked : screenCtrl.endDateClicked) &&
                <View>
                    <Calendar
                        // Initially visible month. Default = Date()
                        current={moment().format('yyyy-MM-DD')}
                        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                        minDate={'2012-05-10'}
                        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                        maxDate={'2021-12-31'}
                        // Handler which gets executed on day press. Default = undefined
                        onDayPress={(day) => {console.log('selected day', day)}}
                        // Handler which gets executed on day long press. Default = undefined
                        onDayLongPress={(day) => {console.log('selected day', day)}}
                        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                        monthFormat={'MM'}
                        // Handler which gets executed when visible month changes in calendar. Default = undefined
                        onMonthChange={(month) => {console.log('month changed', month)}}
                        // Hide month navigation arrows. Default = false
                        // hideArrows={true}
                        // Replace default arrows with custom ones (direction can be 'left' or 'right')
                        // renderArrow={(direction) => (<Arrow/>)}
                        // Do not show days of other months in month page. Default = false
                        hideExtraDays={true}
                        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                        // day from another month that is visible in calendar page. Default = false
                        // disableMonthChange={true}
                        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                        // firstDay={1}
                        // Hide day names. Default = false
                        // hideDayNames={true}
                        // Show week numbers to the left. Default = false
                        // showWeekNumbers={true}
                        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                        onPressArrowLeft={subtractMonth => subtractMonth()}
                        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                        onPressArrowRight={addMonth => addMonth()}
                        enableSwipeMonths={true}

                        // // Collection of dates that have to be marked. Default = {}
                        markedDates={{
                            [moment().format('yyyy-MM-DD')]: {selected: true, selectedColor: '#9fe1e7'}
                        }}
                        // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                        // markingType={'multi-dot'}
                        markingType='multi-period'
                    />
                    {/* Calendar */}
                </View>
            }

            {(title == '시작' ? screenCtrl.strTimeClicked : screenCtrl.endTimeClicked) &&
                <View>
                    { Platform.OS == 'android' ? <WheelTimePicker is12={true}/> : <WheelTimePickerIOS is12={true}/> }
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    dateItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    dateItemRow2: {
        flexDirection: 'row'
    },
});

export default EventTimeSetter;
