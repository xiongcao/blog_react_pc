import React, { Component, Fragment } from 'react';
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom'
import { LocaleProvider } from 'antd';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale-provider/zh_CN';

import BasicLayout from '@layouts/BasicLayout'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render () {
    return (
      <LocaleProvider locale={zhCN}>
        <HashRouter>
          <BasicLayout/>
        </HashRouter>
      </LocaleProvider>
    );
  }
}

export default App;
