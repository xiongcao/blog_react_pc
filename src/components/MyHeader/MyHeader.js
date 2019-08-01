import React, { Component, Fragment } from 'react'
import { Dropdown, Icon, Menu, Breadcrumb } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import store from '@/libs/store.js';
import { heandlOutLogin } from '@/actions/user'
import { oss } from '@/libs/publicPath.js'
import './MyHeader.less'

class MyHeader extends Component{
  constructor(props){
    super(props)
    this.state = {
      user: store.getState().user
    }
    store.subscribe(() => {
      this.setState({
        user: store.getState().user
      })
    })
  }

  outLogin = () => {
    localStorage.clear()
    this.props.dispatch(heandlOutLogin())
    this.props.history.push('/login')
  }

  menu = () => (
    <Menu>
      <Menu.Item key="2" style={{minWidth: 120}} onClick={this.outLogin.bind()}>
        <Icon type="poweroff" />&nbsp;退出登录
      </Menu.Item>
    </Menu>
  );

  render () {
    return <Fragment>
      <div className="breadcrumb">
        {/* <Breadcrumb>
          <Breadcrumb.Item href="">
            <Icon type="home" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="">
            <Icon type="user" />
            <span>Application List</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Application</Breadcrumb.Item>
        </Breadcrumb> */}
      </div>
      <div className="userInfo">
        <Dropdown overlay={this.menu()} placement="bottomRight" style={{left: 'auto', top: 65}}>
          <span className='header-dropdown-link'>
          欢迎您：<span style={{fontWeight: 'bold'}}>{ this.state.user.nickname ? `${this.state.user.nickname} ` : `(${this.state.user.name}) ` } </span>！
          {
            this.state.user.avatar ? <img className="avatar" src={oss + this.state.user.avatar} alt=""/> : (<Icon type="user" style={{fontSize: '20px', marginLeft: '5px'}}/>)
          }
          </span>
        </Dropdown>
      </div>
    </Fragment>
  }
}

export default connect()(withRouter(MyHeader))