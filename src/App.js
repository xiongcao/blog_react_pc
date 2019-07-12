import React, { Component, Fragment } from 'react';
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom'
import { LocaleProvider } from 'antd';
import '@/assets/styles/app.less'

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale-provider/zh_CN';

import BasicLayout from '@layouts/BasicLayout'
import LoginLayout from '@layouts/LoginLayout'

import { PersistGate } from 'redux-persist/es/integration/react'
import {persistStore} from 'redux-persist';
import store from '@/libs/store'
let persistor = persistStore(store);

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render () {
    return (
      <PersistGate persistor={persistor}>
        <LocaleProvider locale={zhCN}>
          <HashRouter>
            {/* <BasicLayout/> */}
            {/* <LoginLayout/> */}
            <Route path = '/admin/home' component = { BasicLayout } />
            <Route path = '/login' component = { LoginLayout } />
          </HashRouter>
        </LocaleProvider>
      </PersistGate>
    );
  }
}

export default App;
