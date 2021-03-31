import React from 'react';
import {FlatList, StyleSheet} from "react-native";
import AlarmListItem from "./AlarmListItem";

const AlarmList = () => {
  return (
    <FlatList style={styles.container}
      keyExtractor={(item) => String(item)}
      data={[1,2,3]}
      renderItem={({item}) => <AlarmListItem item={item}/>
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f9',
    marginHorizontal: 20,
    marginTop: 20
  },
});

export default AlarmList;
