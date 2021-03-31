import moment from 'moment';
import { useEffect, useRef } from 'react';
import { ADDRESS_CODE, BACK_COLOR, CAUTION, CODE_ADDRESS, CUT, HASH, ISO8601_FORMAT, LEVEL_COLOR, LEVEL_LABEL, ROUTE } from './const';
import qs from "query-string";
moment.locale('ko', {
    weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
    weekdaysShort: ["일","월","화","수","목","금","토"],
});

export function classBind() {
    const list = Array.prototype.slice.call(arguments)

    let _list = []
    list.forEach(element => {
        if (Array.isArray(element)) _list = [..._list, ...element]
        else _list.push(element)
    })

    const __list = []
    _list.forEach(element => {
        if (element) __list.push(element)
    })

    return __list.join(' ')
}

export async function getAddress() {
    const coords = await getCurrentCoords()
    const result = await convertPosition(coords)
    return result
}

export function getCurrentCoords() {
    return new Promise(resolve => {
        // setTimeout(() => {
        //     resolve({
        //         latitude: 37.56675038205254,
        //         longitude: 126.98481141959779
        //     })
        // }, 1000)
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            resolve(coords)
        });	
    })
}

export function convertPosition(coords) {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const { latitude, longitude } = coords
    return new Promise(resolve => {
        geocoder.coord2Address(longitude, latitude, result => {
            resolve(result[0].address.address_name)
        });
    })
}

export function reduceAddress(address) {
    if (!address) return ''

    const split = address.split(" ")
    return `${split[1]} ${split[2]}`
}

export function getWeekList(first, length) {
    const added = first + length
    const result = []
    let week = []
    let previous = first
    for (let i = 0; i < added; i++) {
        const value = i + 1 - previous;
        const day = value > 0 ? value : 0;

        if (i % 7 === 0) week = []
        week.push(day)
        if (i % 7 === 6 || i === added - 1) result.push(week)
    }
    return result
}

export function commas(number) {
    if (!number) return 0
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getStartFormat(date) {
    return moment(moment(date).format('YYYY-MM-DD')).format();
}

export function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export function calcFromNow(date) {
    const M = 60
    const H = M * 60
    const D = H * 24
    const W = D * 7

    const createMoment = moment(date)
    const currentMoment = moment()
    const createTime = createMoment.format('X')
    const currentTime = currentMoment.format('X')
    const diffValue = currentTime - createTime
    const diff = Math.abs(diffValue)

    if (diff < M) {
        return `${diff}초 전`;
    }
    else if (diff >= M && diff < H) {
        const minute = Math.floor(diff / M);
        return `${minute}분 전`;
    }
    else if (diff >= H && diff < D) {
        const hour = Math.floor(diff / H);
        return `${hour}시간 전 `;
    }
    else if (diff >= D && diff < W) {
        const day = Math.floor(diff / D);
        return `${day}일 전 `;
    }
    else {
        const week = Math.floor(diff / W);
        return `${week}주 전 `
    }
}

export function descend(b, a) {
    return a > b ? -1 : a < b ? 1 : 0
}

export function addLink(text) {
    const regUrl = new RegExp("(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)", "gi");
    const regEmail = new RegExp("([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+.[a-z0-9-]+)", "gi");
    return text.replace(regUrl, "<a href='$1://$2' target='_blank'>$1://$2</a>").replace(regEmail, "<a href='mailto:$1'>$1</a>")
}

export function freezeBody() {
    document.body.classList.add("freeze");
}

export function unfreezeBody() {
    document.body.classList.remove("freeze");
}

export function getBaseDate() {
    return moment().format();
    // const now = moment();
    // const hh = Number(now.format("H"));
    // if (hh >= 10) return now.format();
    // else return moment(now.format("YYYY-MM-DD")).subtract(1, 'seconds').format();
}

export function getLabel(score) {
    if (score === undefined) return "확인중";
    if (score <= CUT[0]) return LEVEL_LABEL[0];
    if (score <= CUT[1]) return LEVEL_LABEL[1];
    else return LEVEL_LABEL[2];
}

export function getColor(score, black) {
    if (score === undefined) return black ? "#000" : "#cdd1d7";
    if (score <= CUT[0]) return LEVEL_COLOR[0];
    if (score <= CUT[1]) return LEVEL_COLOR[1];
    else return LEVEL_COLOR[2];
}

export function getBackgroundColor(score) {
    if (score === undefined) return "#f7f7f9";
    if (score <= CUT[0]) return BACK_COLOR[0];
    if (score <= CUT[1]) return BACK_COLOR[1];
    else return BACK_COLOR[2];
}

export function getCaution(score) {
    if (score <= CUT[0]) return CAUTION[0];
    if (score <= CUT[1]) return CAUTION[1];
    else return CAUTION[2];
}

export function getTabFromHash(hash) {
    if (hash === HASH.riskcare) return 0;
    if (hash === HASH.contact) return 1;
    if (hash === HASH.mental) return 1;
    if (hash === HASH.dashboard) return 2;
    return 0;
}

export function getSubFromHash(hash) {
    if (hash === HASH.contact) return 0;
    if (hash === HASH.mental) return 1;
}

export function getHashFromTab(tab, sub) {
    if (tab === 0) return HASH.riskcare;
    if (tab === 1) return sub === 1 ? HASH.mental : HASH.contact;
    if (tab === 2) return HASH.dashboard;
    return HASH.riskcare;
}

export function windowConfirm(text) {
    // eslint-disable-next-line no-restricted-globals
    return (window.confirm || confirm)(text);
}

export function getRandrom(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function convertFormat(time) {
    return time.replace("+", "%2B");
}

export function verifyCode(code) {
    const address = CODE_ADDRESS[code]
    if (address) return code;
    return ADDRESS_CODE[code];
}

export function makeExplanatinoLink(item) {
    const stringified = qs.stringify({
        code: item.locationCode,
        current: item.current,
    }, { skipEmptyString: true });
    return `${ROUTE.explanation}?${stringified}`
}

export function getTodayFormatted(converted, date) {
    const today = date ? moment(date) : moment();
    if (converted) return convertFormat(today.format(ISO8601_FORMAT));
    else return today.format();
}

export function getDelta(value) {
    if (!value) return "- ";
    if (value > 0) return `+${value}`;
    return value;
}

export function getDeltaColor(value) {
    if (!value) return "#000";
    if (value > 0) return "#ff6341";
    return "#6236ff";
}

export function getAddressFromCode(code) {
    const address = CODE_ADDRESS[code];
    if (!address) return {};

    const split = address.split(" ");
    return {
        gu: split[0],
        dong: split[1]
    }
}