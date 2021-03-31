import React from 'react';
import {View, Text} from 'react-native';
import {useSelector} from "react-redux";
import ModalWebView from "./components/common/ModalWebView";
import {useAxiosLoader} from "./api/api";

const AbstractHoc = ({children}) => {

    const [loading, ready] = useAxiosLoader();
    const { webViewModal } = useSelector(state => state.common);

    if (ready) {
        return (
          <View style={{flex: 1, backgroundColor: 'white' }}>
              { loading && <View><Text>Loading</Text></View> }
              { webViewModal.show && <ModalWebView/> }
              {children}
          </View>
        )
    } else {
        return <View>
            <Text>로딩중..</Text>
        </View>
    }

};

export default AbstractHoc;
