import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

import CalendarArrow from "./CalendarArrow";
import AddEventModal from "../AddEventModal";
import {useSelector} from "react-redux";

const CalendarHeader = ({ calData, yearAndMonth, addMonth }) => {
    // console.log('=== CHECK', moment(calData.month).format(calData.monthFormat));

    /******************
     * state
     *****************/
    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const { user } = useSelector(state => state.user);

    /******************
     * destructuring
     *****************/

    return (
        <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', padding: 10}}>
            <View style={{flexDirection: 'row'}}>
                <CalendarArrow direction={'left'} addMonth={addMonth}/>
                <Text style={{fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10}}>{yearAndMonth}</Text>
                <CalendarArrow direction={'right'} addMonth={addMonth}/>
            </View>

            <View>
                { user &&
                    <TouchableOpacity
                        onPress={() => setShowAddEventModal(true)}
                        style={{backgroundColor: '#e7e9f0', borderRadius: 20, paddingHorizontal: 10}}>
                        <Text style={{padding: 10,}}>+ 일정 추가</Text>
                    </TouchableOpacity>
                }

                { user && showAddEventModal && <AddEventModal close={setShowAddEventModal}/> }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default CalendarHeader;
