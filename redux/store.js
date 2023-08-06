// redux/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import splashReducer from './reducers';

const rootReducer = combineReducers({
  splash: splashReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
