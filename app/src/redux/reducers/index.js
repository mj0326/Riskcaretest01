// Imports: Dependencies
import {combineReducers} from 'redux';

// Imports: Reducers
import commonReducer from './commonReducer';
import userReducer from "./userReducer";

// Redux: Root Reducer
const rootReducer = combineReducers({
  common: commonReducer,
  user: userReducer,
});

// Exports
export default rootReducer;
