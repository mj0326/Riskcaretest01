import moment from "moment";

export default class GoogleService {

    constructor(apiKey, accessToken) {
        this.apiKey = apiKey;
        this.accessToken = accessToken;
        this.options = {
            method: '',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json;',
            }
        };
    }

    /********************
     * custom
     ********************/
    /**
     * init calendar
     * */
    async initCalendar() {
        // const timeMin = moment().clone().startOf('month').format('yyyy-MM-DDThh:mm:ss') + 'Z';
        // const timeMax = moment().clone().endOf('month').format('yyyy-MM-DDThh:mm:ss') + 'Z';

        const timeMin = moment().clone().startOf('month').format('yyyy-MM-DDThh:mm:ss-hh:mm');
        const timeMax = moment().clone().endOf('month').format('yyyy-MM-DDThh:mm:ss-hh:mm');

        // console.log('==== TIME_MIN & TIME_MAX', typeof timeMin, timeMax);

        const cals = [];
        let eventList = [];
        const calendars = await this.getCalendarList();
        for (const cal of calendars.items) {
            const event = await this.getEventList(cal.id, timeMin, timeMax);
            // console.log('==== EVT CONT', event);
            if(event.items !== undefined) {
                cals.push({key: cal.id, color: cal.backgroundColor, events: event.items});
                for(const e of event.items) {
                    e.calId = cal.id;
                    e.calColor = cal.backgroundColor;
                    eventList.push(e);
                }
            }
        }

        // sort event list
        eventList.sort((a, b) => ((a.start.date !== undefined ? a.start.date : a.start.dateTime) > (b.start.date !== undefined ? b.start.date : b.start.dateTime)) ? 1 : -1 );

        // return 값
        let result = {
            calStyles: cals,
            calEventList: [],
            eventList: eventList
        };

        let connectedEvents = {};
        let singleEvents = {};
        for(const event of eventList) {
            const calColor = event.calColor;

            let startDate = moment(event.start.date ? event.start.date : event.start.dateTime);
            let endDate = moment(event.end.date ? event.end.date : event.end.dateTime);

            // single event
            if(endDate.diff(startDate, 'day') == 1) {
                const formattedSDt = startDate.format('yyyy-MM-DD');
                // 기존에 있는 경우
                if(singleEvents[formattedSDt] !== undefined) {
                    singleEvents[formattedSDt].periods.push({ startingDay: true, endingDay: true, color: calColor });
                // 기존에 없는 경우
                } else {
                    let data = { periods: [{ startingDay: true, endingDay: true, color: calColor }] };
                    singleEvents[formattedSDt] = data;
                }
            // connected event
            } else {
                let formattedSDt = startDate.format('yyyy-MM-DD');
                const tempArr = new Array(endDate.diff(startDate, 'day'));

                let beforeLength = 0;

                for(let i = 0; i < tempArr.length; i++) {
                    let data;
                    // 기존에 있는 경우
                    if(connectedEvents[formattedSDt] !== undefined) {
                        // 전처리(transparent)
                        if(connectedEvents[formattedSDt].periods !== undefined) {
                            beforeLength = connectedEvents[formattedSDt].periods.length;
                        }

                        // 시작일
                        if(i === 0) {
                            connectedEvents[formattedSDt].periods.push({ startingDay: true, endingDay: false, color: calColor });
                        // 마지막 일
                        } else if(i === tempArr.length - 1) {
                            connectedEvents[formattedSDt].periods.push({ startingDay: false, endingDay: true, color: calColor });
                        } else {
                            connectedEvents[formattedSDt].periods.push({ startingDay: false, endingDay: false, color: calColor });
                        }
                    // 기존에 없는 경우
                    } else {
                        data = { periods: [] };

                        // 전처리(transparent)
                        for(let j = 0; j < beforeLength; j++) {
                            data.periods.push({color: 'transparent'});
                        }

                        // 시작일
                        if(i === 0) {
                            beforeLength = data.periods.length;
                            data.periods.push({ startingDay: true, endingDay: false, color: calColor });
                        // 마지막 일
                        } else if(i === tempArr.length - 1) {
                            data.periods.push({ startingDay: false, endingDay: true, color: calColor });
                        // 끼인 날
                        } else {
                            data.periods.push({ startingDay: false, endingDay: false, color: calColor });
                        }
                        connectedEvents[formattedSDt] = data;
                    }
                    // 시작일에서 날짜 하루 증가
                    formattedSDt = startDate.add(1, 'day').format('yyyy-MM-DD');
                }
            }
        }

        // console.log('=== SINGLE EVT', JSON.stringify(singleEvents));
        // console.log('=== CONN EVT', JSON.stringify(connectedEvents));

        // single, connected event 합치기
        for(const seKey of Object.keys(singleEvents)) {
            if(connectedEvents[seKey] !== undefined && connectedEvents[seKey].periods !== undefined) {
                connectedEvents[seKey].periods = connectedEvents[seKey].periods.concat(singleEvents[seKey].periods);
            } else {
                connectedEvents[seKey] = { ...singleEvents[seKey] };
            }
        }
        result.calEventList = JSON.stringify(connectedEvents);

        // console.log('=== LAST', result.calEventList);

        return result;
    }

    /********************
     * google api
     ********************/

    /**
     * google api 호출
     * */
    async callApi(url, options) {
        const response = await fetch(url, options);
        const res = await response.json();

        return res;
    }

    /**
     * calendar 목록 조회
     * */
    async getCalendarList() {
        const url = `https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${this.apiKey}`;
        this.options.method = 'GET';

        return await this.callApi(url, this.options);
    }

    /**
     * calendar event 목록 조회
     * */
    async getEventList(calendarId, timeMin, timeMax) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}&key=${this.apiKey}`;
        this.options.method = 'GET';

        return await this.callApi(url, this.options);
    }


}
