import reducersApp from '@/reducers'
import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise'
import thunk from 'redux-thunk'
import {persistCombineReducers} from 'redux-persist';
import storage from 'redux-persist/es/storage'

const reducer = persistCombineReducers(
  {
    key: 'root',
    storage,
  }, reducersApp);

 export default createStore(reducer, applyMiddleware(promise, thunk))