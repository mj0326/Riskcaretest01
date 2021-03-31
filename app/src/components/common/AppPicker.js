import React from 'react';
import {Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import I18n from '../../i18n';

const AppPicker = ({close, list}) => {
  return (
    <Modal animationType='fade'
           transparent={true}
           onRequestClose={close}>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback style={{flex: 1}} onPress={close}>
          <View style={styles.innerContainer}>
            <View style={styles.itemList}>
              {
                list.map((item, i) => {
                    const borderStyle = i < list.length - 1 ? { borderBottomColor: '#eeeeee', borderBottomWidth: 1 } : {};
                  return <TouchableOpacity
                      key={i}
                      style={{ ...styles.item, ...borderStyle, } } onPress={item.func}>
                    <Text>{ I18n.t(item.name) }</Text>
                  </TouchableOpacity>
                })
              }


            </View>
            <TouchableOpacity onPress={close} style={styles.cancelBtn}>
              <Text style={{ color: '#2b2d97' }}>{ I18n.t('lnb.cancel') }</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000AA',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginVertical: 8,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemList: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 12,
  },
  item: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  }

});

export default AppPicker;
