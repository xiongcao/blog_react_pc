import React, { Component, Fragment } from 'react';
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom'
import { LocaleProvider, Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

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
        <Layout>
          <Sider
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
              <Menu.Item key="1">
                <Icon type="user" />
                <span className="nav-text">nav 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="video-camera" />
                <span className="nav-text">nav 2</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="upload" />
                <span className="nav-text">nav 3</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Header style={{ background: '#fff', padding: 0 }} />
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
              <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
                content
              </div>
            </Content>
            <Footer style={{ textAlign: 'center', position: 'fixed', bottom: '0', width: 'calc(100% - 200px)' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
        </Layout>
      </LocaleProvider>
    );
  }

  // changeTheme(theme){
  //   this.setState({
  //     theme
  //   });
  // }
  // render() {
  //   return (
  //     <Fragment>
  //       <HashRouter>
  //         <BasicLayout></BasicLayout>
  //         <div className="App" onClick={this.changeTheme.bind(this,"sss")}>{this.state.theme}</div>
  //       </HashRouter>
  //     </Fragment>
  //   );
  // }
}

export default App;
