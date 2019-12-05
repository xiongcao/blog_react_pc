import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom'
import { Menu } from 'antd'
import * as Fetch from '@/libs/fetch';
import Index from './index'
import Password from './password'
import Phone from './phone'
import Email from './email'
import BindAccount from './bind'

import '../personal/index.less'
import './index.less'

class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current: '',
    }
  }

  UNSAFE_componentWillMount () {
    document.title = '熊博园-账号设置'
    this.initData()
  }

  initData () {
    this.getUserInfo()
    let pathname = this.props.history.location.pathname
    let paths = pathname.split("/")
    this.setState({
      current: paths[paths.length - 1]
    })
  }

  UNSAFE_componentWillReceiveProps () {
    this.initData()
  }

  getUserInfo () {
    Fetch.get(`user/findAdmin`)
  }

  handleNavClick = (e) => {
    this.setState({
      current: e.key
    });
  }

  render() {
    let { match } = this.props
    let { current } = this.state
    console.log(current, 'current')
    return (
      <div className="frontend-setting">
        <section>
        <div className="sidebar">
          <Menu className="frontend-user-menu" 
            onClick={this.handleNavClick.bind(this)} 
            defaultSelectedKeys={[current]}>
            <Menu.Item key="index">
              <Link to={`${match.url}/index`}><span>账号设置首页</span></Link>
            </Menu.Item>
            <Menu.Item key="password">
            <Link to={`${match.url}/password`}><span>修改密码</span></Link>
            </Menu.Item>
            <Menu.Item key="phone">
            <Link to={`${match.url}/phone`}><span>修改手机</span></Link>
            </Menu.Item>
            <Menu.Item key="email">
              <Link to={`${match.url}/email`}><span>修改邮箱</span></Link>
            </Menu.Item>
            <Menu.Item key="bind">
              <Link to={`${match.url}/bind`}><span>绑定登录账号</span></Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className="content">
          <Route path={`${match.url}/index`} component={Index}/>
          <Route path={`${match.url}/password`} component={Password}/>
          <Route path={`${match.url}/phone`} component={Phone}/>
          <Route path={`${match.url}/email`} component={Email}/>
          <Route path={`${match.url}/bind`} component={BindAccount}/>
        </div>
        </section>
      </div>
    );
  }
}

export default Setting;