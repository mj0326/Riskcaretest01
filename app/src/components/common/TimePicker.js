import React, {useRef, useState} from 'react';
import { Animated, Text, View, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';

const BUTTON_HEIGHT = 50;
const VIEW_HEIGHT = 50 * 3;

const TimePicker = () => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [ref, setRef] = useState(null);

    const isEnd = (event, cnt) => {
        if(event.nativeEvent.contentOffset.y >= BUTTON_HEIGHT * cnt) {
            return true;
        } else {
            return false;
        }
    }
    const scrollFirst = (event) => {
        console.log('==== END');
        ref!= null && ref.scrollTo({
            y: 0,
            animated: true
        });
    }

    return (
        <View style={styles.view}>
            <View style={styles.container}>
                <ScrollView
                    ref={(ref) => setRef(ref)}
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    onScroll={(event)=>{
                        if(isEnd(event, 1)) {
                            scrollFirst(event);
                        }
                    }}>
                    {['', '오전', '오후', ''].map((item, idx) => (
                        <Button key={idx} label={item} />
                    ))}
                </ScrollView>
                <ScrollView
                    style={[styles.scrollView, { marginHorizontal: 12 }]}
                    showsVerticalScrollIndicator={false}
                    onScroll={(event)=>{{
                        if(isEnd(event, 11)) {
                            scrollFirst(event);
                        }
                    }}}>
                    {[ '', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '' ].map((item, idx) => (
                        <Button key={idx} label={item} />
                    ))}
                </ScrollView>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {['', '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '',].map((item, idx) => (
                        <Button key={idx} label={item} />
                    ))}
                </ScrollView>
                <OverlayView/>
            </View>
        </View>
    );
}

const Button = ({ label }) => {
    return (
        <TouchableWithoutFeedback>
            <View style={styles.button}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const OverlayView = () => {
    return (
        <View
            pointerEvents={'none'}
            style={[StyleSheet.absoluteFill, styles.overlay]}>
            <View style={styles.overlayVisibleView}>
                <View style={styles.overlayVisibleViewInner} />
                <View style={[styles.overlayVisibleViewInner, { marginLeft: 12 }]} />
                <View
                    style={{ alignItems: 'center', justifyContent: 'center', width: 12 }}>
                    <Text style={styles.buttonLabel}>{':'}</Text>
                </View>
                <View style={styles.overlayVisibleViewInner} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    container: {
        alignSelf: 'center',
        flexDirection: 'row',
        height: VIEW_HEIGHT,
    },
    scrollView: {
        flex: 1,
    },

    button: {
        height: BUTTON_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLabel: {
        fontWeight: 'bold',
    },

    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayVisibleView: {
        width: '100%',
        height: BUTTON_HEIGHT,
        flexDirection: 'row',
        borderRadius: 100,
        backgroundColor: 'rgba(52, 52, 52, 0.3)',
    },
    overlayVisibleViewInner: {
        flex: 1,
    },
});

export default TimePicker;
