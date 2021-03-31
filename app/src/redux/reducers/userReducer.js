import {SET_USER_SIGN_UP, SET_GOOGLE_TOKENS, SET_USER} from "./actionTypes";

// Initial State
const initialState = {
  userSignUpDto: {},
  user: undefined,
  googleApiKey: 'AIzaSyBAJqVEv1lDQuTrlR9t6P-2i3GLtTY3HX8',
  googleTokens: {}
};

// Redux: User Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_SIGN_UP:
      return { ...state, userSignUpDto: action.payload }
    case SET_GOOGLE_TOKENS:
      return { ...state, googleTokens: action.payload }
    case SET_USER:
      return { ...state, user: action.payload }
    default:
      return state;
  }
};

// Exports
export default userReducer;
