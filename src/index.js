import "babel-polyfill";
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import store from '@/libs/store'

ReactDOM.render(
  <Provider store = { store }>
    <App/>
  </Provider>
  , document.getElementById('app'))


// 热更新
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <NextApp/>
      </AppContainer>
    </Provider>
    ,document.getElementById('app')
    )
  })
}