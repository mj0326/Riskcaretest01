import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootSaga from './sagas'
import rootReducer from './reducers';

// redux flipper
const createDebugger = require('redux-flipper').default;

const reduxDebugger = createDebugger();

const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(composeWithDevTools(applyMiddleware(sagaMiddleware, reduxDebugger)));
export const store = createStore(rootReducer, enhancer);
sagaMiddleware.run(rootSaga);

