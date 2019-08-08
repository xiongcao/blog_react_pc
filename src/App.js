import React, { Component, Fragment } from 'react';
import { BrowserRouter, HashRouter, Route, Redirect } from 'react-router-dom'
import { LocaleProvider } from 'antd';
import 'normalize.css'
import '@/assets/styles/app.less'

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale-provider/zh_CN';

import AdminLayout from '@layouts/AdminLayout'
import LoginLayout from '@layouts/LoginLayout'
import BasicLayout from '@layouts/BasicLayout'

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
            <Route path = '/' render={() => <Redirect to='/frontend'></Redirect>} exact/>
            <Route path = '/frontend' component = { BasicLayout }/>
            <Route path = '/admin' component = { AdminLayout } />
            <Route path = '/login' component = { LoginLayout } />
            <Route path = '/register' component = { LoginLayout } />
          </HashRouter>
        </LocaleProvider>
      </PersistGate>
    );
  }
}

export default App;
