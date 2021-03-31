import React, {useState} from 'react';
import {Modal, Text, TextInput, TouchableOpacity, View, SafeAreaView, StyleSheet, Switch} from "react-native";

import ModalHeader from "../../components/common/ModalHeader";
import EventTimeSetter from "./component/EventTimeSetter";
import SearchLocationModal from "./SearchLocationModal";

const AddEventModal = ({ close }) => {
    /******************
     * state
     *****************/
    const [screenCtrl, setScreenCtrl] = useState({
        strDateClicked: false,
        strTimeClicked: false,
        endDateClicked: false,
        endTimeClicked: false,
        isAllDay: false,
    });
    const [showSearchLocationModal, setShowSearchLocationModal] = useState(false);
    const [eventData, setEventData] = useState({
        title: '',
        location: {},
        isAllDay: false,
        start: {
            date: null,
            dateTime: null,
            timeZone: null
        },
        end: {
            date: null,
            dateTime: null,
            timeZone: null
        }
    });

    return (
        <Modal>
            <SafeAreaView style={styles.container}>
                <ModalHeader headerTxt={'일정 추가'} isCenter={true} close={close.bind(this, false)}></ModalHeader>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputItem}
                        placeholder={'제목을 입력하세요'}
                        maxLength={50}
                        // onFocus={() => console.log('==== FOCUS')}
                        // onBlur={() => console.log('==== BLUR')}
                        // onChangeText={setSearchTxt}
                        // onSubmitEditing={search}
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}/>
                    <TouchableOpacity onPress={() => setShowSearchLocationModal(!showSearchLocationModal)}>
                        <TextInput
                            style={styles.inputItem}
                            placeholder={'장소를 입력하세요'}
                            editable={false}
                            value={eventData.location.dong}
                        ></TextInput>
                    </TouchableOpacity>

                    { showSearchLocationModal && <SearchLocationModal setEventData={setEventData} eventData={eventData} close={setShowSearchLocationModal}/>}
                </View>

                <View style={styles.dateContainer}>
                    <View style={styles.dateItemRow}>
                        <Text>하루 종일</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={screenCtrl.isAllDay ? "#f5dd4b" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(val) => setScreenCtrl({
                                ...screenCtrl,
                                isAllDay: val,
                                strTimeClicked: val ? false : screenCtrl.strTimeClicked,
                                endTimeClicked: val? false : screenCtrl.endTimeClicked
                            })}
                            value={screenCtrl.isAllDay}
                        />
                    </View>

                    <EventTimeSetter title={'시작'} screenCtrl={screenCtrl} setScreenCtrl={setScreenCtrl} />
                    <EventTimeSetter title={'종료'} screenCtrl={screenCtrl} setScreenCtrl={setScreenCtrl} />
                </View>
            </SafeAreaView>
        </Modal>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f7f7f9',
        flex: 1
    },

    inputContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'grey',
        marginVertical: 20,
        backgroundColor: 'white'
    },
    inputItem: {
        paddingHorizontal: 10,
        color: 'black'
    },

    dateContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'grey',
        marginVertical: 20,
        backgroundColor: 'white'
    },
    dateItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
});

export default AddEventModal;
