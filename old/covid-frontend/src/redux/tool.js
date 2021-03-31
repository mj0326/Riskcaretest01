import { createAction, handleActions } from 'redux-actions'

function createAsyncActionType(name) {
  return {
    INDEX: `${name}_INDEX`,
    SUCCESS: `${name}_SUCCESS`
  }
}

function createAsyncAction(action) {
  let asyncAction = createAction(action.INDEX)
  asyncAction.success = createAction(action.SUCCESS)
  return asyncAction
}

function handleAction(action, reducer, processor) {
  return {
    [action]: (state, { payload }) => ({
      ...state,
      [reducer]: processor ? processor(state[reducer], payload) : payload
    })
  }
}

function handleAsyncAction(action, reducer, processor) {
  return {
    [action.SUCCESS]: (state, { payload }) => ({
      ...state,
      [reducer]: processor ? processor(state[reducer], payload) : payload
    })
  }
}

export {
  createAction,
  createAsyncAction,
  createAsyncActionType,
  handleAction,
  handleAsyncAction,
  handleActions
}
