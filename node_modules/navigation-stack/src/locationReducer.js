import ActionTypes from './ActionTypes';

export default function locationReducer(state, action) {
  if (action.type === ActionTypes.UPDATE) {
    return action.payload;
  }
  return state;
}
