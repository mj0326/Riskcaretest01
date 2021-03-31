import React from 'react';
import {Text, TouchableOpacity, Image, FlatList, StyleSheet, View} from 'react-native';
import Images from '../../../assets';

const CheckboxList = ({checkboxItem, state, setState}) => {
    // state destructuring
    const {selectedItemId, checkboxes} = state;

    const onCheckboxChange = (checkedEvent, workspace) => {
        setCheckbox(checkedEvent, workspace.id);
        setSelectedWorkspaces(checkedEvent, workspace.id);
    }

    /**
     * checkbox 의 checked 여부 저장
     * */
    const setCheckbox = (isChecked, workspaceId) => {
        let copiedCheckboxes = [...checkboxes];
        const checkboxIdx = copiedCheckboxes.findIndex(chb => chb.id == workspaceId);
        copiedCheckboxes[checkboxIdx].checked = isChecked;
        setState({...state, checkboxes: copiedCheckboxes});
    }

    /**
     * selected item 의 id 저장
     * */
    const setSelectedWorkspaces = (isChecked, workspaceId) => {
        if(isChecked == true) {
            setState({...state, selectedItemId: selectedItemId.concat(workspaceId)});
        } else {
            setState({...state, selectedItemId: selectedItemId.filter(wId => wId != workspaceId)});
        }
    }

    return (
        <View style={styles.checkboxContainer}>
            <FlatList
                keyExtractor={(item) => String(item.id)}
                data={checkboxItem}
                renderItem={({item}) =>
                    (
                        <View style={styles.checkboxRow}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => onCheckboxChange(!item.checked, item)}>
                                {item.checked && <Image source={Images.checkbox} style={styles.checkboxImg}/> }
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>{item.name}</Text>
                        </View>
                    )
                }
            />
        </View>
    )
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flex: 1,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#dddddd',
        backgroundColor: '#ffffff',
        marginRight: 10,
        position: 'relative'
    },
    checkboxImg: {
        alignContent: "center",
        width: 24,
        height: 24,
        backgroundColor: 'white',
        position: 'absolute',
        top: -2,
        left: -2,
    },
    checkboxLabel: {
        height: 20,
        marginTop: 2,
        marginRight:0,
        marginBottom:2,
        marginLeft:10,
        fontSize: 14,
        fontWeight: 'normal',
        color: '#111111'
    },
});

export default CheckboxList;
