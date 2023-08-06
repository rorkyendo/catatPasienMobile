// redux/reducers.js
import { ActionTypes } from './actions';

const initialState = {
  isLoading: true,
};

const splashReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.HIDE_SPLASH_SCREEN:
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export default splashReducer;
