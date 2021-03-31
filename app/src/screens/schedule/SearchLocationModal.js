import React, {useState} from 'react';
import {FlatList, Modal, TextInput, View, SafeAreaView, StyleSheet, Text, TouchableOpacity} from "react-native";

import AppButton from "../../components/common/AppButton";
import ModalHeader from "../../components/common/ModalHeader";
import {prodUrl} from "../../config";
import {COMMON_CODE} from "../../constants/Constants";

const SearchLocationModal = ({ setEventData, eventData, close }) => {
    // const { webViewModal } = useSelector(state => state.common);
    // const dispatch = useDispatch();
    // const webviewRef = useRef();
    // const userAgent = userAgentConfig;

    const [searchTxt, setSearchTxt] = useState('');
    const [locSearchList, setLocationSearchList] = useState([]);

    // /**
    //  * 웹뷰 통신 처리
    //  */
    // const onReceiveMessage = (event) => {
    //     // await AsyncStorage.setItem(ASYNC_STORAGE_KEY.CHANNEL_LIST)
    //     // 로그인 완료가 되면 channelList에 넣고 currentChannel에 값을 준다.
    //     // console.log('이벤트', event.nativeEvent);
    //
    //     try {
    //         let data;
    //         data = JSON.parse(`${event.nativeEvent.data}`);
    //
    //         // console.log(data);
    //
    //         switch (data.type) {
    //             case WEBVIEW_EVENT_TYPE.CLOSE_MODAL:
    //                 console.log('==== 모달 닫기 ====');
    //                 onClose();
    //             case WEBVIEW_EVENT_TYPE.SHARE_LINK:
    //                 share(data.data)
    //                 break;
    //             default:
    //                 break;
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    // /**
    //  * 모달 닫기
    //  */
    // const onClose = () => {
    //     close.bind(this, false);
    // }

    /**
     * 장소 검색 api
     * */
    const searchLocation = async () => {
        // call api
        const url = `${prodUrl}/apps/search/location?searchText=${searchTxt}`;
        const options = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;',
            }
        };

        const response = await fetch(url, options);
        const res = await response.json();
        // console.log('==== SEARCH ', res);

        if(res.code === COMMON_CODE.SUCCESS) {
            setLocationSearchList(res.data);
            return;
        } else {
            // api call fail
            setLocationSearchList([]);
        }
    }

    /**
     * inputText enter 입력시
     * */
    const searchLocationHandler = (e) => {
        if(e.nativeEvent.key == 'Enter') {
            searchLocation().then(r => console.log('=== RESULT', r));
        }
    }

    /**
     * location data 저장
     * */
    const setLocation = (locationData) => {
        // console.log('=== LOCATION DATA', locationData);
        setEventData({...eventData, location: locationData});
        close(false);
    }

    return(
        <Modal>
            <SafeAreaView style={styles.container}>
                <ModalHeader headerTxt={'일정 장소 추가'} isCenter={true} close={close.bind(this, false)} />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputItem}
                        placeholder={'일정에 추가할 주소를 입력하세요'}
                        maxLength={100}
                        // onFocus={() => console.log('==== FOCUS')}
                        // onBlur={() => console.log('==== BLUR')}
                        onChangeText={setSearchTxt}
                        // onSubmitEditing={searchTxt}
                        value={searchTxt}
                        onKeyPress={(e) => searchLocationHandler(e) }
                        returnKeyType="done"
                        autoCapitalize="none"
                        autoCorrect={false}/>
                </View>

                <View style={ locSearchList.length == 0 ? {backgroundColor: 'white', borderRadius: 10} : {backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: 'grey'}}>
                    <FlatList
                        keyExtractor={(item) => String(item.lDongCd)}
                        data={locSearchList}
                        renderItem={({item}) =>
                            (
                                <TouchableOpacity
                                    style={{backgroundColor: 'white', borderRadius: 10, padding: 10}}
                                    onPress={() => {setLocation(item)}}>
                                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.dong}</Text>
                                    <Text>{item.siDo} {item.siGunGu} {item.dong}</Text>
                                </TouchableOpacity>
                            )
                        }
                    />
                </View>

                <AppButton title={'장소 검색'} click={searchLocation}/>

                {/*<WebView*/}
                {/*    style={{flex: 1}}*/}
                {/*    source={{*/}
                {/*        uri: `${prodUrl}/home/interest/add`*/}
                {/*    }}*/}
                {/*    ref={webviewRef}*/}
                {/*    userAgent={userAgent}*/}
                {/*    javaScriptEnabled={true}*/}
                {/*    onMessage={(event) => {*/}
                {/*        onReceiveMessage(event)*/}
                {/*    }}*/}
                {/*    mediaPlaybackRequiresUserAction={true}*/}
                {/*    textZoom={100}*/}
                {/*    mixedContentMode="always"*/}
                {/*    domStorageEnabled*/}
                {/*    allowFileAccess={true}*/}
                {/*    scalesPageToFit={true}*/}
                {/*    originWhitelist={['*']}*/}
                {/*/>*/}
            </SafeAreaView>
        </Modal>
    )
}

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
        paddingHorizontal: 10
    },
});

export default SearchLocationModal;
