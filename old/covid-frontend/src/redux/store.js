import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { reducer, initialState } from './'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware()
const enhancer = compose(composeWithDevTools(applyMiddleware(sagaMiddleware)))
export const store = createStore(reducer, initialState, enhancer)
sagaMiddleware.run(rootSaga)
