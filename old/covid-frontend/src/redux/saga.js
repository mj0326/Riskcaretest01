
import moment from 'moment';
import { put, takeLatest, all, call, select } from 'redux-saga/effects'
import { loadFavorite, loadSchedule, LOAD_FAVORITE, LOAD_SCHEDULE, setPositioning, SET_REGION_DATA, setRegionData, STACK_MESSAGES, stackMessages, LOAD_INFORMATION, loadInformation, SET_PANEL_DATA, setPanelData, SET_CHART_DATA, setChartData, GET_CURRENT_POSITION, getCurrentPosition, SET_EXPLANATION, setExplanation, SET_POPUP, ADD_FAVORITE, addFavorite, ADD_SCHEDULE, LOAD_PROVINCE_MESSAGES, LOAD_CITY_MESSAGES, loadProvinceMessages, loadCityMessages, REMOVE_FAVORITE, removeFavorite, REMOVE_SCHEDULE, SET_SCHEDULE_DETAILS, setScheduleDetails, SET_SCORE_RANKING, setScoreRanking, SET_DONG_DETAIL, setDongDetail } from '.'
import { postSearchLocationPatientsTotal, postSearchLocationPatientsDaily, postSearchTimeExtractPatients, postSearchCovidList, getFavorLocationsMy, patchFavorLocations, getEventsSearch, getEvents, deleteEvents, postEvents, patchEvents, postSearchSocialContact, postSearchCovidBlue, postSearchTrendCovidStat, postSearchTrendSocialContact } from '../others/api';
// import { postSearchTrendPatients } from '../others/api';
import { ADDRESS_CODE, CHART_DATE_INPUT, CHART_DATE_OUTPUT, CODE_ADDRESS, EVENT_TIME_FORMAT, HASH, ISO8601_FORMAT, SCORE_KEY, SCORE_NAME, CHART_DATE_INPUT_2 } from '../others/const';
import { freezeBody, getAddress, getStartFormat, getBaseDate, reduceAddress, unfreezeBody, getTodayFormatted, getAddressFromCode } from '../others/util';

function* getCurrentPositionAsync() {
	try {
		yield put(setPositioning(true))
		const address = yield call(getAddress)
		const locationName = reduceAddress(address)
		const ldongCd = ADDRESS_CODE[locationName]
		const current = yield call(postSearchSocialContact, { ldongCd })
		const locationScore = current[0].contact_score;
		const result = { locationName, locationScore, locationCode: ldongCd, current: true };
		yield put(getCurrentPosition.success(result));	
	}
	catch(e) {
		console.error(e);
	}
	finally {
		yield put(setPositioning(false));
	}
}

function* loadFavoriteAsync() {
	try {
		const list = yield call(getFavorLocationsMy);
		const _list = []
		for (let i = 0; i < list.length; i++) {
			const item = list[i]
			if (item.locationScore === undefined) {
				const current = yield call(postSearchSocialContact, { ldongCd: item.locationCode });
				if (current.length) {
					item.locationScore = current[0].contact_score;
				}
			}
			_list.push(item)
		}

		yield put(loadFavorite.success(_list));
	}
	catch(e) {
		console.error(e);
	}
	finally {
		yield put(getCurrentPosition());
	}
}

function* loadScheduleAsync(action) {
	const { payload } = action;
		
	try {
		const result = yield call(getEventsSearch, payload);
		
		const schedule = {}
		for (let item of result) {
			const { startTime } = item;
			const DD = Number(moment(startTime).format("DD"))
			item.startTime = moment(item.startTime).format(EVENT_TIME_FORMAT);
			item.endTime = moment(item.endTime).format(EVENT_TIME_FORMAT);
			if (!schedule[DD]) schedule[DD] = [item];
			else schedule[DD].push(item);
		}

		if (Object.keys(schedule).length) {
			yield put(loadSchedule.success(schedule));
		}	
	}
	catch(e) {
		console.error(e);
	}
}

function* addFavoriteAsync(action) {
	const { payload } = action;
	const previous = yield select(state => state.favorite);
	const index = previous.findIndex(item => item.id === payload.id);
	const op = index === -1 ? "add" : "replace";
	payload.seq = index === -1 ? previous.length : previous[index].seq;

	try {
		const result = yield call(patchFavorLocations, [{ op, ...payload }]);		
		if (op === "add" && result[0]) result[0].locationScore = payload.locationScore;
		yield put(addFavorite.success([...previous, ...result]));
	}
	catch(e) {
		console.error(e);
	}
}

function* removeFavoriteAsync(action) {
	const { payload } = action;
	const previous = yield select(state => state.favorite);
	const mapped = payload.map(id => ({ op: "remove", id }))

	try {
		yield call(patchFavorLocations, mapped);
		const filtered = previous.filter(item => !payload.includes(item.id));
		yield put(removeFavorite.success(filtered));
	}
	catch(e) {
		console.error(e);
	}
}

function* addScheduleAsync(action) {
	const { detail, callback } = action.payload;
	detail.location = detail.locationName;
	detail.startTime = moment(detail.startTime, EVENT_TIME_FORMAT).format(ISO8601_FORMAT);
	detail.endTime = moment(detail.endTime, EVENT_TIME_FORMAT).format(ISO8601_FORMAT);

	try {
		yield call(detail.id ? patchEvents : postEvents, detail)
		callback();
	}
	catch (e) {
		console.error(e)
	}
}

function* removeScheduleAsync(action) {	
	try {
		const { id, callback } = action.payload
		yield call(deleteEvents, id);
		callback();
	}
	catch (e) {
		console.error(e)
	}
}

function* loadInformationAsync() {
	try {
		const today = getBaseDate();
		const total = yield call(postSearchLocationPatientsTotal, today);
		const sum = yield call(postSearchLocationPatientsTotal, today, ["합계"]);
		const daily = yield call(postSearchLocationPatientsDaily, today);
		yield put(loadInformation.success({ total, daily }));
		yield put(setPanelData({ daily, sum: sum[0].today }));
		yield put(setChartData());
		yield put(setRegionData({ total, daily }));
	}
	catch(e) {
		console.error(e)
	}
}

function* stackMessagesAsync() {
	const messages = yield select(state => state.messages);
	const last = messages[0];
	const end = moment().format();
	const start = last 
		? moment(last.t).add(1, 'second').format() 
		: getStartFormat(end);

	try {
		const result = yield call(postSearchCovidList, {
			interval: `${start}/${end}`,
		})	

		if (result.length) {
			yield put(stackMessages.success([...result, ...messages]))
		}
	}
	catch(e) {
		console.error(e)
	}
}

function* setPanelDataAsync(action) {
	const { daily, sum, delta } = action.payload

	if (delta !== undefined) {
		const _sum = yield select(state => state.panelData.sum);
		const _newly = yield select(state => state.panelData.newly);
		yield put(setPanelData.success({ sum:_sum, delta, newly: _newly }))	
	}
	else {
		const _delta = yield select(state => state.panelData.delta)
		let newly = 0;
		daily.forEach(item => { newly += item.today; })	
		yield put(setPanelData.success({ sum, delta: _delta, newly }))	
	}
}

function* setChartDataAsync() {
	const today = getBaseDate();
	const yesterday = moment(today).subtract(1, 'day').format();
	const todayStart = getStartFormat(today);
	const yesterdayStart = getStartFormat(yesterday);

	try {
		const hourlyResult = yield call(postSearchTimeExtractPatients, {
			extractUnit: 'hour',
			aggregation: 'sum',
			labels: ["어제", "오늘"],
			ranges: [`${yesterdayStart}/${yesterday}`, `${todayStart}/${today}`],
		})
	
		const pastToday = moment(today).subtract(7, 'day').format()
		// const weeklyResult = yield call(postSearchTrendPatients, {
		// 	extractUnit: 'hour',
		// 	aggregation: 'sum',
		// 	interval: `${pastToday}/${today}`
		// })
	
		const statResult = yield call(postSearchTrendCovidStat, { 
			interval: `${pastToday}/${today}`
		})

		const hourly = []
		hourlyResult.categories.slice(8).forEach((category, index) => {
			const value = { name: `${category}` };
			hourlyResult.series.forEach(item => { value[item.label] = item.data.slice(8)[index]; })
			hourly.push(value)
		})
	
		const weekly = []
		const found = statResult.series.find(item => item.label === "daily_confirmed_cnt");
		statResult.categories.forEach((category, index) => {
			const data = found.data[index];
			found && weekly.push({ 
				name: moment(category, CHART_DATE_INPUT_2).subtract(1, "day").format('DD'),
				data,
				min: 0,
				label: data
			})	
		})

		const todayDate = moment();
		const todayFormat = todayDate.format(CHART_DATE_INPUT_2);
		if (statResult.categories.slice(-1)[0] !== todayFormat) {
			const yesterdayLastTime = moment(todayFormat, CHART_DATE_INPUT_2).subtract(1, "seconds");
			const daily = yield call(postSearchLocationPatientsDaily, yesterdayLastTime.format(ISO8601_FORMAT));
			let min = 0;
			daily.forEach(item => { min += item.yesterday; });
			weekly.push({
				name: todayDate.clone().subtract(1, "day").format("DD"),
				data: 0,
				min,
				label: `${min} (집계중)`
			});
		}
	
		if (found) yield put(setPanelData({ delta: found.data.slice(-1)[0] }));
		yield put(setChartData.success({ hourly, weekly }))
	}
	catch(e) {
		console.error(e)
	}
}

function* setRegionDataAsync(action) {
	const { total, daily } = action.payload
	
	const data = {}	
	total.forEach(item => {
		data[item.si_do] = { sum: item.today, delta: item.today - item.yesterday, newly: 0 };
	})
	daily.forEach(item => {
		data[item.si_do].newly = item.today;
	})
	
	yield put(setRegionData.success(data))
}

function* setExplanationAsync(action) {
	let { payload } = action;
	if (payload === undefined) {
		yield put(setExplanation.success());
	}
	else {
		const { locationCode: ldongCd, current } = payload;
		const result = yield call(postSearchSocialContact, { ldongCd })
		const _result = result[0] || {};
		const { si_gun_gu, dong } = _result;
		const explanation = {
			locationName: (si_gun_gu && dong) ? `${si_gun_gu} ${dong}` : CODE_ADDRESS[ldongCd],
			locationScore: _result.contact_score,
			locationcode: _result.ldong_cd,
			flow: _result.flow_score,
			taxi: _result.taxi_score,
			subway: _result.subway_score,
			outdoor: _result.outdoor_activity_score,
		}
		if (current) explanation.current = true;
		yield put(setExplanation.success(explanation));
	}
}

// eslint-disable-next-line
function* setPopupSync(action) {
	const { payload } = action;
	if (payload) {
		freezeBody();
		// for app
		window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "OPEN_POPUP" }, '*'));
	} else {
		unfreezeBody();
		// for app
		window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: "CLOSE_POPUP" }, '*'));
	}
}

function* loadProvinceMessagesAsync(action) {
	try {
		const { payload } = action
		const end = moment().format();
		const start = getStartFormat(end);
		const result = yield call(postSearchCovidList, {
			siDo: [payload],
			interval: `${start}/${end}`,
		});

		const _result = yield call(postSearchLocationPatientsDaily,
			end,
			[payload],
			"siGunGu"
		)

		yield put(loadProvinceMessages.success({
			messages: result,
			count: _result
		}))		
	}
	catch(e) {
		console.error(e);
	}
}

function* loadCityMessagesAsync(action) {
	try {
		const { province, city } = action.payload
		const end = moment().format();
		const start = getStartFormat(end);
		const result = yield call(postSearchCovidList, {
			siDo: [province],
			siGunGu: province !== city ? [city] : undefined,
			interval: `${start}/${end}`,
		});
		yield put(loadCityMessages.success(result));	
	}
	catch(e) {
		console.error(e);
	}
}

function* setScheduleDetailsAsync(action) {
	try {
		const { payload } = action;
		const details = yield call(getEvents, payload);
		yield put(setScheduleDetails.success(details));		
	}
	catch (e) {
		console.error(e);
	}
}

function* setScoreRankingAsync(action) {
	try {
		const { gu, hash } = action.payload;

		const isPsycho = hash === HASH.mental;
		const search = isPsycho ? postSearchCovidBlue : postSearchSocialContact;
		const scoreKey = isPsycho ? "total_score" : "contact_score";
		const rankKey = isPsycho ? "total_rank" : "contact_rank";
		const todayDate = isPsycho ? "2020-10-01" : moment().format(CHART_DATE_INPUT);
		const yesterdayDate = isPsycho ? "2020-10-01" : moment().subtract(1, "day").format(CHART_DATE_INPUT);
		
		const today = yield call(search, { baseDateTime: getTodayFormatted(false, todayDate), siGunGu: gu });
		const yesterday = yield call(search, { baseDateTime: getTodayFormatted(false, yesterdayDate), siGunGu: gu });
	
		const childKey = gu ? "dong" : "si_gun_gu";
		const result = {};
		today.forEach(item => {
			result[item[childKey]] = {
				code: item.ldong_cd,
				score: item[scoreKey],
				rank: item[rankKey]
			}
		});
		yesterday.forEach(item => {
			const previous = result[item[childKey]];
			previous.score_delta = previous.score - item[scoreKey];
			previous.rank_delta = previous.rank - item.contact_rank;
		});
	
		yield put(setScoreRanking.success(result));
	}
	catch(e) {
		console.error(e);
	}
}

function* setDongDetailAsync(action) {
	const { payload } = action;
	if (!payload) {
		yield put(setDongDetail.success({}));
		return
	}

	try {
		const { gu, dong } = getAddressFromCode(payload);
		const contact = yield call(postSearchSocialContact, { baseDateTime: getTodayFormatted(false), ldongCd: payload });
		const mental = yield call(postSearchCovidBlue, { baseDateTime: getTodayFormatted(false, "2020-10-01"), siGunGu: gu } );
		const index = mental.findIndex(item => item.dong === dong);
		const found = mental[index];
		found.si_gun_gu = gu;

		const weekly = [];
		const { categories, series } = yield call(postSearchTrendSocialContact, { ldongCd: payload })

		categories.forEach((date, index) => {
			weekly.push({
				name: moment(date, CHART_DATE_INPUT).format(CHART_DATE_OUTPUT),
				[SCORE_NAME[SCORE_KEY.flow]]: series.find(item => item.label === SCORE_KEY.flow).data[index],
				[SCORE_NAME[SCORE_KEY.taxi]]: series.find(item => item.label === SCORE_KEY.taxi).data[index],
				[SCORE_NAME[SCORE_KEY.subway]]: series.find(item => item.label === SCORE_KEY.subway).data[index],
				[SCORE_NAME[SCORE_KEY.contact]]: series.find(item => item.label === SCORE_KEY.contact).data[index],
				// [SCORE_NAME[SCORE_KEY.outdoor]]: series.find(item => item.label === SCORE_KEY.outdoor).data[index],
			})
		})
		
		yield put(setDongDetail.success({ contact: contact[0], mental: found, weekly }));	
	}
	catch(e) {
		console.error(e);
	}
}

function* watchGetCurrentPosition() { yield takeLatest(GET_CURRENT_POSITION.INDEX, getCurrentPositionAsync) }
function* watchLoadFavorite() { yield takeLatest(LOAD_FAVORITE.INDEX, loadFavoriteAsync) }
function* watchLoadSchedule() { yield takeLatest(LOAD_SCHEDULE.INDEX, loadScheduleAsync) }
function* watchAddFavorite() { yield takeLatest(ADD_FAVORITE.INDEX, addFavoriteAsync) }
function* watchRemoveFavorite() { yield takeLatest(REMOVE_FAVORITE.INDEX, removeFavoriteAsync) }
function* watchAddSchedule() { yield takeLatest(ADD_SCHEDULE.INDEX, addScheduleAsync) }
function* watchRemoveSchedule() { yield takeLatest(REMOVE_SCHEDULE.INDEX, removeScheduleAsync) }
function* watchLoadInformation() { yield takeLatest(LOAD_INFORMATION.INDEX, loadInformationAsync) }
function* watchStackMessages() { yield takeLatest(STACK_MESSAGES.INDEX, stackMessagesAsync) }
function* watchSetPanelData() { yield takeLatest(SET_PANEL_DATA.INDEX, setPanelDataAsync) }
function* watchSetChartData() { yield takeLatest(SET_CHART_DATA.INDEX, setChartDataAsync) }
function* watchSetRegionData() { yield takeLatest(SET_REGION_DATA.INDEX, setRegionDataAsync) }
function* watchSetExplanation() { yield takeLatest(SET_EXPLANATION.INDEX, setExplanationAsync) }
function* watchSetPopup() { yield takeLatest(SET_POPUP, setPopupSync) }
function* watchLoadProvinceMessages() { yield takeLatest(LOAD_PROVINCE_MESSAGES.INDEX, loadProvinceMessagesAsync) }
function* watchLoadCityMessages() { yield takeLatest(LOAD_CITY_MESSAGES.INDEX, loadCityMessagesAsync) }
function* watchSetScheduleDetails() { yield takeLatest(SET_SCHEDULE_DETAILS.INDEX, setScheduleDetailsAsync) }
function* watchScoreRanking() { yield takeLatest(SET_SCORE_RANKING.INDEX, setScoreRankingAsync) }
function* watchSetDongDetail() { yield takeLatest(SET_DONG_DETAIL.INDEX, setDongDetailAsync) }

export default function* root() {
	yield all([
		watchGetCurrentPosition(),
		watchLoadFavorite(),
		watchLoadSchedule(),
		watchAddFavorite(),
		watchRemoveFavorite(),
		watchAddSchedule(),
		watchRemoveSchedule(),
		watchLoadInformation(),
		watchStackMessages(),
		watchSetPanelData(),
		watchSetChartData(),
		watchSetRegionData(),
		watchSetExplanation(),
		watchSetPopup(),
		watchLoadProvinceMessages(),
		watchLoadCityMessages(),
		watchSetScheduleDetails(),
		watchScoreRanking(),
		watchSetDongDetail(),
	])
}
