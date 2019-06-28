import reducersApp from '@/reducers'
import { createStore, applyMiddleware } from 'redux'
import promise from 'redux-promise'
import thunk from 'redux-thunk'

 export default createStore(reducersApp, applyMiddleware(promise, thunk))