import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useDispatch, useSelector} from "react-redux";

import {Calendar} from "react-native-calendars";
import RNCalendarEvents from "react-native-calendar-events";
import moment from 'moment';
import {GoogleSignin} from "@react-native-google-signin/google-signin";

import {SET_GOOGLE_TOKENS} from "../../redux/reducers/actionTypes";
import {PORTAL} from "../../constants/Constants";
import GoogleService from "../../service/GoogleService";
import SocialLoginButtons from "../../components/common/SocialLoginButtons";
import CalendarHeader from "./component/CalendarHeader";

const MySchedule = ({ navigation }) => {
    const dispatch = useDispatch();
    let calendarService;
    const selectedDtColor = '#87cefa';
    const markedDateInit = { [moment().format('yyyy-MM-DD')]: {selected: true, selectedColor: 'black'} };

    /******************
     * state
     *****************/
    let calRef = useRef(null);
    const [eventList, setEventList] = useState([]);
    const [selectedEventList, setSelectedEventList] = useState([]);
    const [calEventList, setCalEventList] = useState({});
    const [markedDates, setMarkedDates] = useState(markedDateInit);
    const [curYearAndMonth, setCurYearAndMonth] = useState(moment().format('yyyy년 MM월'));
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const { googleTokens, googleApiKey, user } = useSelector(state => state.user);

    /******************
     * destructuring
     *****************/
    const { accessToken, idToken } = googleTokens;

    /**
     * sign out
     * */
    const signOut = async () => {
        // google sign out
        await GoogleSignin.signOut();
        dispatch({ type: SET_GOOGLE_TOKENS, payload: {} });
    }

    /**
     * calendar event 조회
     * */
    useEffect(() => {
        // permission 확인
        RNCalendarEvents.requestPermissions(false).then(result => {
            // console.log('=== CAL PERM : ', result);

            if(result == 'authorized') {

                // 각 portal 별 service init
                switch (user.userType) {
                    case PORTAL.GOOGLE :
                        calendarService = new GoogleService(googleApiKey, accessToken);
                        break;
                    case PORTAL.KAKAO :
                        break;
                    case PORTAL.APPLE :
                        break;
                    case PORTAL.TID:
                        break;
                    default:
                        break;
                }

                if(accessToken) {
                    calendarService.initCalendar()
                        .then(result => {
                            console.log('==== RESULT ', result.eventList);
                            setEventList(result.eventList);
                            setSelectedEventList(result.eventList.filter(item => { moment().isBetween(moment(item.start.date).subtract(1, 'day'), item.end.date) }));
                            setCalEventList(JSON.parse(result.calEventList));
                        });
                }

                // RNCalendarEvents.findCalendars().then(calenders => {
                //     // console.log('=== CALENDARS', calenders);
                //
                //     let calStyles = {};
                //     calenders.forEach(c => { calStyles[c.id] = {key: c.id, color: c.color}; });
                //
                //     const startDate = new Date(new Date().setDate(1)).toISOString();
                //     const endDate = new Date().toISOString();
                //
                //     // event 조회
                //     RNCalendarEvents.fetchAllEvents(startDate, endDate).then(events => {
                //         // console.log('==== events ', events);
                //
                //         setEventList([...events]);
                //         // let temp = new Object;
                //         // events.forEach(e => {
                //         //     let date = moment(e.startDate).format('yyyy-MM-DD');
                //         //     if(temp[date]) {
                //         //         if(!temp[date].dots.includes(calStyles[e.calendar.id])) {
                //         //             temp[date] = { dots: [...temp[date].dots, calStyles[e.calendar.id]]};
                //         //         }
                //         //     } else {
                //         //         temp[date] = { dots: [calStyles[e.calendar.id]]};
                //         //     }
                //         // });
                //         // setCalEventList({...temp});
                //     });
                // });

            } else {
                console.log('=== CAL PERM ', result);
            }

        });

        // event 저장
        // RNCalendarEvents.saveEvent('', {
        //     calendarId: id.toString(),
        //     startDate: new Date(new Date().setDate(3)).toISOString(),
        //     endDate: new Date(new Date().setDate(3)).toISOString()
        // }).catch(err => console.log('===ERR', err));

        // event 삭제
        // RNCalendarEvents.removeCalendar('435128A1-792B-47B1-ADF4-4F7B598B135E').then(r => console.log(r));

        // calendar ui config
        // LocaleConfig.locales['ko'] = {
        //   monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
        //   monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
        //   dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
        //   dayNamesShort: ['일','월','화','수','목','금','토'],
        //   today: '일요일\'일'
        // };
        // LocaleConfig.defaultLocale = 'ko';
    }, []);

    /**
     * left arrow, right arrow 핸들러
     * */
    const addMonthHandler = (val) => {
        if (calRef) {
            // console.log('==== CAL REF', calRef);
            calRef.addMonth(val);

            let temp = curYearAndMonth;
            temp = temp.replace('년', '');
            temp = temp.replace('월', '').trim();
            temp = temp.replace(' ', '-');

            if(val == 1) {
                setCurYearAndMonth(moment(temp).add(1, 'month').format('yyyy년 MM월'));
            }
            if(val == -1) {
                setCurYearAndMonth(moment(temp).subtract(1, 'month').format('yyyy년 MM월'));
            }
        }
    };

    return (
            <View style={{flex: 1}}>
                { !user && <Text style={{textAlign: 'center', paddingVertical: 30, fontSize: 20}}>로그인이 {"\n"}필요한 서비스 입니다.</Text> }

                { !user && <SocialLoginButtons/> }

                {/*{ accessToken && <TouchableOpacity onPress={() => signOut()}><Text>Sign out</Text></TouchableOpacity> }*/}

                { user &&
                    <View style={{backgroundColor: 'transparent', margin: 20, flex: 2}}>
                        <Calendar
                        // Calender reference
                        ref={(ref) => (calRef = ref)}
                        style={{borderRadius: 15, padding: 10, marginBottom: 10}}
                        // Initially visible month. Default = Date()
                        current={moment().format('yyyy-MM-DD')}
                        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                        minDate={'2012-05-10'}
                        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                        maxDate={'2021-12-31'}
                        // Handler which gets executed on day press. Default = undefined
                        onDayPress={(day) => {
                            console.log('selected day', day);
                            setSelectedEventList(eventList.filter(item => { if(moment(day.dateString).isBetween(moment(item.start.date).subtract(1, 'day'), item.end.date)) { return item; } }));
                            setMarkedDates({ ...markedDateInit, [day.dateString]: { selected: true, selectedColor: selectedDtColor } });
                        }}
                        // Handler which gets executed on day long press. Default = undefined
                        onDayLongPress={(day) => {console.log('selected day long press', day)}}
                        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                        monthFormat={'yyyy년 MM월'}
                        // Handler which gets executed when visible month changes in calendar. Default = undefined
                        onMonthChange={(month) => {
                            console.log('month changed', month);
                            // setCurYearAndMonth(moment(month.dateString).format('yyyy년 MM월'));
                        }}
                        // Hide month navigation arrows. Default = false
                        // hideArrows={true}
                        // Replace default arrows with custom ones (direction can be 'left' or 'right')
                        // renderArrow={(direction) => {return <CalendarArrow direction={direction}/>}}
                        // Do not show days of other months in month page. Default = false
                        // hideExtraDays={true}
                        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                        // day from another month that is visible in calendar page. Default = false
                        // disableMonthChange={true}
                        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                        firstDay={1}
                        // Hide day names. Default = false
                        // hideDayNames={true}
                        // Show week numbers to the left. Default = false
                        // showWeekNumbers={true}
                        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                        onPressArrowLeft={subtractMonth => subtractMonth()}
                        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                        onPressArrowRight={addMonth => addMonth()}
                        // Disable left arrow. Default = false
                        // disableArrowLeft={true}
                        // Disable right arrow. Default = false
                        // disableArrowRight={true}
                        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                        // disableAllTouchEventsForDisabledDays={true}
                        // Replace default month and year title with custom one. the function receive a date as parameter.
                        // renderHeader={(date) => { return <CalendarHeader date={date}/> }}
                        // Enable the option to swipe between months. Default = false
                        enableSwipeMonths={true}
                        customHeader={(calData) => {
                            return <CalendarHeader
                                        calData={calData}
                                        yearAndMonth={curYearAndMonth}
                                        addMonth={addMonthHandler}/>
                        }}

                        // Collection of dates that have to be marked. Default = {}
                        // markedDates={{
                        //     [moment().format('yyyy-MM-DD')]: {selected: true, selectedColor: 'black'},
                        //     ...calEventList
                        // }}
                        markedDates={markedDates}
                        // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                        // markingType={'multi-dot'}
                        // markingType='multi-period'
                        />
                    {/* Calendar */}
                    </View> }

                { user &&
                    <View style={{flex: 1, marginTop: 50, marginHorizontal: 20, marginBottom: 20, borderRadius: 20, backgroundColor: 'white'}}>
                        <FlatList
                            style={{}}
                            keyExtractor={(item) => String(item.id)}
                            data={selectedEventList}
                            renderItem={({item, index}) => (
                                <View key={index} style={styles.eventContainer}>
                                    <View>
                                        <Text style={{fontSize: 13}}>{item.start.date !== undefined ? '하루 종일' : moment(item.start.dateTime, 'hh:mm')}</Text>
                                        <Text style={{fontSize: 15, fontWeight: 'bold'}}>{item.summary}</Text>
                                        <Text style={{fontSize: 10}}>{item.location}</Text>
                                    </View>
                                    <View style={{borderRadius: 500, backgroundColor: 'yellow', padding: 10}}><Text>{index+1}</Text></View>
                                </View>
                            )}/>
                    </View>
                }

            </View>
    )
};

const styles = StyleSheet.create({
    eventContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15,
        overflow: 'hidden'
    },
});

export default MySchedule;
