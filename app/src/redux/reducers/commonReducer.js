// Initial State

import {SET_SHOW_MODAL, SET_WEB_VIEW_MODAL} from './actionTypes';

const initialState = {
  showMyPage: false,
  showAlarm: false,
  webViewModal: {
    show: false,
    url: ''
  }
};

// Redux: Common Reducer
const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SHOW_MODAL:
    return {
      ...state,
      [action.payload.type]: action.payload.value
    }
    case SET_WEB_VIEW_MODAL:
    return {
      ...state,
      webViewModal: action.payload
    }
    default:
    return state;
  }
};

// Exports
export default commonReducer;
