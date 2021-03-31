import {
	createAction,
	createAsyncAction,
	createAsyncActionType,
	handleAction,
	handleAsyncAction,
	handleActions
} from './tool'

export const SET_POSITIONING = 'SET_POSITIONING'
export const GET_CURRENT_POSITION = createAsyncActionType("GET_CURRENT_POSITION");
export const LOAD_FAVORITE = createAsyncActionType('LOAD_FAVORITE')
export const LOAD_SCHEDULE = createAsyncActionType('LOAD_SCHEDULE')
export const ADD_FAVORITE = createAsyncActionType("ADD_FAVORITE");
export const REMOVE_FAVORITE = createAsyncActionType("REMOVE_FAVORITE");
export const ADD_SCHEDULE = createAsyncActionType("ADD_SCHEDULE");
export const REMOVE_SCHEDULE = createAsyncActionType("REMOVE_SCHEDULE");
export const LOAD_INFORMATION = createAsyncActionType('LOAD_INFORMATION')
export const STACK_MESSAGES = createAsyncActionType('STACK_MESSAGES')
export const SET_PANEL_DATA = createAsyncActionType("SET_PANEL_DATA");
export const SET_CHART_DATA = createAsyncActionType("SET_CHART_DATA");
export const SET_REGION_DATA = createAsyncActionType("SET_REGION_DATA");
export const SET_EXPLANATION = createAsyncActionType("SET_EXPLANATION");
export const SET_POPUP = "SET_POPUP";
export const LOAD_PROVINCE_MESSAGES = createAsyncActionType("SET_PROVINCE_MESSAGES");
export const LOAD_CITY_MESSAGES = createAsyncActionType("LOAD_CITY_MESSAGES");
export const SET_SCHEDULE_DETAILS = createAsyncActionType("SET_SCHEDULE_DETAILS");
export const SET_SCORE_RANKING = createAsyncActionType("SET_SCORE_RANKING");
export const SET_DONG_DETAIL = createAsyncActionType("SET_DONG_DETAIL");

export const setPositioning = createAction(SET_POSITIONING)
export const getCurrentPosition = createAsyncAction(GET_CURRENT_POSITION)
export const loadFavorite = createAsyncAction(LOAD_FAVORITE)
export const loadSchedule = createAsyncAction(LOAD_SCHEDULE)
export const addFavorite = createAsyncAction(ADD_FAVORITE);
export const removeFavorite = createAsyncAction(REMOVE_FAVORITE);
export const addSchedule = createAsyncAction(ADD_SCHEDULE);
export const removeSchedule = createAsyncAction(REMOVE_SCHEDULE);
export const loadInformation = createAsyncAction(LOAD_INFORMATION)
export const stackMessages = createAsyncAction(STACK_MESSAGES)
export const setPanelData = createAsyncAction(SET_PANEL_DATA);
export const setChartData = createAsyncAction(SET_CHART_DATA);
export const setRegionData = createAsyncAction(SET_REGION_DATA);
export const setExplanation = createAsyncAction(SET_EXPLANATION);
export const setPopup = createAction(SET_POPUP);
export const loadProvinceMessages = createAsyncAction(LOAD_PROVINCE_MESSAGES);
export const loadCityMessages = createAsyncAction(LOAD_CITY_MESSAGES);
export const setScheduleDetails = createAsyncAction(SET_SCHEDULE_DETAILS);
export const setScoreRanking = createAsyncAction(SET_SCORE_RANKING);
export const setDongDetail = createAsyncAction(SET_DONG_DETAIL);

export const initialState = {
	positioning: false,
	position: {},
	favorite: [],
	schedule: {},
	information: { total: [], daily: [] },
	messages: [],
	panelData: { sum: 0, delta: 0, newly: 0 },
	chartData: { hourly: [], weeky: [] },
	regionData: {},
	explanation: undefined,
	popup: undefined,
	provinceData: { messages: [], count: {} },
	cityMessages: [],
	scheduleDetails: {},
	scoreRanking: {},
	dongDetail: {},
}

export const reducer = handleActions({
	...handleAction(SET_POSITIONING, 'positioning'),
	...handleAsyncAction(GET_CURRENT_POSITION, 'position'),
	...handleAsyncAction(LOAD_FAVORITE, 'favorite'),
	...handleAsyncAction(LOAD_SCHEDULE, 'schedule'),
	...handleAsyncAction(ADD_FAVORITE, "favorite"),
	...handleAsyncAction(REMOVE_FAVORITE, "favorite"),
	...handleAsyncAction(ADD_SCHEDULE, "schedule"),
	...handleAsyncAction(REMOVE_SCHEDULE, "schedule"),
	...handleAsyncAction(LOAD_INFORMATION, 'information'),
	...handleAsyncAction(STACK_MESSAGES, 'messages'),
	...handleAsyncAction(SET_PANEL_DATA, 'panelData'),
	...handleAsyncAction(SET_CHART_DATA, 'chartData'),
	...handleAsyncAction(SET_REGION_DATA, 'regionData'),
	...handleAsyncAction(SET_EXPLANATION, 'explanation'),
	...handleAction(SET_POPUP, "popup"),
	...handleAsyncAction(LOAD_PROVINCE_MESSAGES, 'provinceData'),
	...handleAsyncAction(LOAD_CITY_MESSAGES, 'cityMessages'),
	...handleAsyncAction(SET_SCHEDULE_DETAILS, 'scheduleDetails'),
	...handleAsyncAction(SET_SCORE_RANKING, 'scoreRanking'),
	...handleAsyncAction(SET_DONG_DETAIL, 'dongDetail'),
}, initialState )

