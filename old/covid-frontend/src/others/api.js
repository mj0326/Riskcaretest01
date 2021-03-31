import axios from "axios";
import { HOST, ISO8601_FORMAT, MONTH_FORMAT, AJAX_HEADER } from "./const";
import { convertFormat, verifyCode, getTodayFormatted } from './util';
import moment from "moment";

function delete_cookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const instance = axios.create({ headers: AJAX_HEADER });

// refresh token Routine
instance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        // if login token is expired and refresh token is empty -> login page
        if (error.response.status === 400 && error.response.data === 'RefreshToken is null') {
            delete_cookie('LOGIN_TOKEN');
            window.location = '/';
        }

        // if login token is expired and refresh token is weird -> login page
        if (error.response.status === 401 && error.response.data.code === 'GB0001') {
            delete_cookie('LOGIN_TOKEN');
            window.location = '/';
        }

        // if login token is expired or invalid and refresh token is valid
        if (error.response.status === 401 && error.response.data.code === 'GB0005') {

            // delete_cookie('LOGIN_TOKEN');

            // return instance.post(`${HOST}/api/oauth/token?type=refresh_token`)
            //     .then(response => {
            //         document.cookie = `LOGIN_TOKEN=${response.data.access_token}; path=/; max-age=43199`;
            //         document.cookie = `REFRESH_LOGIN_TOKEN=${response.data.refresh_token}; path=/; max-age=100000000`;
            //
            //         return instance(originalRequest);
            //     })
            //     .catch(error => {
            //         if (error.response.status === 401) {
            //             delete_cookie('LOGIN_TOKEN');
            //             window.location = '/';
            //         }
            //     })
        }
    }
);

export async function postSearchLocationPatientsTotal(baseDateTime, siDo) {
    const { data } = await instance.post(`${HOST}/api/search/location/patients/total`, { baseDateTime, siDo })
    return data
}

export async function postSearchLocationPatientsDaily(baseDateTime, siDo, baseGroup) {
    const { data } = await instance.post(`${HOST}/api/search/location/patients/daily`, { baseDateTime, siDo, baseGroup })
    return data
}

export async function postSearchTimeExtractPatients({ extractUnit, aggregation, ranges, labels }) {
    const { data } = await instance.post(`${HOST}/api/search/timeextract/patients`, {
        extractUnit,
        aggregation,
        ranges,
        labels
    });
    return data
}

export async function postSearchTrendPatients({ extractUnit, aggregation, interval }) {
    const { data } = await instance.post(`${HOST}/api/search/trend/patients`, { extractUnit, aggregation, interval });
    return data
}

export async function postSearchCovidList({ siDo, siGunGu, limit, interval, includeZeroConfirmed }) {
    const { data } = await instance.post(`${HOST}/api/search/covid/list`, {
        siDo,
        siGunGu,
        limit,
        interval,
        includeZeroConfirmed,
    })
    return data
}

export async function getFavorLocationsMy(baseDateTime = getTodayFormatted(true)) {
    const { data } = await instance.get(`${HOST}/api/favorlocations/my?includeIndex=true&baseDateTime=${baseDateTime}`);
    const mapped = data.map(item => ({ ...item, locationCode: verifyCode(item.locationCode) }));
    return mapped;
}

export async function getLocationsDongSearch(locationName, baseDateTime = getTodayFormatted(true)) {
    try {
        const result = await instance.get(`${HOST}/api/locations/dong/search?name=${locationName}&includeIndex=true&baseDateTime=${baseDateTime}`);
        const { content } = result.data;
        return content;    
    }
    catch(e) {
        console.error(e);
        return []
    }
}

export async function patchFavorLocations(body) {
    const { data } = await instance.patch(`${HOST}/api/favorlocations`, body);
    return data
}

export async function getEventsSearch(month) {
    const startTime = convertFormat(moment(month, MONTH_FORMAT).format(ISO8601_FORMAT));
    const endTime = convertFormat(moment(month, MONTH_FORMAT).add(1, "month").subtract(1, "seconds").format(ISO8601_FORMAT));
    const { data } = await instance.get(`${HOST}/api/events/search?includeIndex=true&startTime=${startTime}&endTime=${endTime}`);
    return data;
}

export async function getEvents(id) {
    const { data } = await instance.get(`${HOST}/api/events/${id}`);
    return data;
}

export async function deleteEvents(id) {
    const { data } = await instance.delete(`${HOST}/api/events/${id}`);
    return data
}

export async function postEvents(body) {
    const { data } = await instance.post(`${HOST}/api/events`, body);
    return data;
}

export async function patchEvents(body) {
    const { data } = await instance.patch(`${HOST}/api/events/${body.id}`, body);
    return data;
}

export async function postSearchTrendSocialContact(body) {
    const { data } = await instance.post(`${HOST}/api/search/trend/socialcontact`, body);
    return data
}

export async function postSearchSocialContact({
    baseDateTime = getTodayFormatted(false),
    siGunGu,
    ldongCd
}) {
    const { data } = await instance.post(`${HOST}/api/search/socialcontact`, {
        baseDateTime,
        siGunGu,
        ldongCd
    });
    return data;
}

export async function postSearchCovidBlue({
    baseDateTime = getTodayFormatted(false, "2020-10-01"),
    siGunGu,
    ldongCd
}) {
    const { data } = await instance.post(`${HOST}/api/search/covidblue`, {
        baseDateTime,
        siGunGu,
        ldongCd
    });
    return data;
}

export async function postSearchTrendCovidStat({
    siDo,
    interval
}) {
    const { data } = await instance.post(`${HOST}/api/search/trend/covidstat`, {
        siDo,
        interval
    })
    return data;
}
