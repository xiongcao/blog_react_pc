import React, { Component } from 'react'
import { withRouter, Route, Link } from 'react-router-dom'
import Home from '@pages/frontend/index/index.js'
import store from '@/libs/store'
import logo from '@/assets/img/logo.svg';
import lingdang from '@/assets/icon/lingdang.svg';
import lingdang_active from '@/assets/icon/lingdang_active.svg';
import { oss } from '@/libs/publicPath.js'
import { Menu, Icon, Button, Avatar, Dropdown } from 'antd';

import './BasicLayout.less'

class BasicLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      user: store.getState().user,
      notification: lingdang,
      current: 'index'
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }


  goToAdminPage = () => {
    this.props.history.push('/admin/home')
  }
  
  geToEssayPage = () => {
    this.props.history.push('/admin/essay/essayEdit/-1')
  }

  handleEnter = () => {
    this.setState({
      notification: lingdang_active
    })
  }

  handleOut = () => {
    this.setState({
      notification: lingdang
    })
  }

  handleNavClick = (e) => {
    this.setState({
      current: e.key,
    });
  }


  render() {
    let { user, notification, current } = this.state
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="BasicLayout">
        <header>
          <nav>
            <div className="logo">
              <img src={logo} />
            </div>
            <Menu 
              style={{lineHeight: '62px'}}
              onClick={this.handleNavClick} 
              selectedKeys={[current]} 
              mode="horizontal">
              <Menu.Item key="index">
                <Link to="/index">
                  <Icon type="home" /> 首页
                </Link>
              </Menu.Item>
              <Menu.Item key="ordered-list">
                <Link to="/index">
                  <Icon type="ordered-list" /> 文章
                </Link>
              </Menu.Item>
              <Menu.Item key="project">
                <Link to="/index">
                  <Icon type="project" /> 归档
                </Link>
              </Menu.Item>
              <Menu.Item key="question-circle">
                <Link to="/index">
                  <Icon type="question-circle" /> 问答
                </Link>
              </Menu.Item>
              <Menu.Item key="message">
                <Link to="/index">
                  <Icon type="message" /> 留言
                </Link>
              </Menu.Item>
              <Menu.Item key="user">
                <Link to="/index1">
                  <Icon type="user" /> 关于
                </Link>
              </Menu.Item>
            </Menu>
            <div className="user">
              {
                user.id ? (
                  <>
                    <Avatar className="notification" src={notification} onMouseEnter={this.handleEnter} onMouseLeave={this.handleOut}/>
                    <Dropdown overlay={menu} placement="bottomRight">
                      <div className="ant-dropdown-link" style={{display: 'inline-block', height: '100%', cursor: 'pointer'}}>
                        { user.avatar ? <Avatar src={oss + user.avatar}/> : <Avatar  type="user"/> }
                        <Icon type="caret-down" style={{fontSize: '14px', color: '#a0a0a0'}}/>
                      </div>
                    </Dropdown>
                  </>
                ) : (
                  <Button icon="profile" type="link" onClick={this.geToEssayPage}>写文章</Button> | 
                  <Button type="link">登录 · 注册</Button>
                )
              }
            </div>
          </nav>
        </header>
        <article>
          <Route path="/index" component={Home} exact/>
        </article>
        <footer>全栈修炼 ©2018 Created by XiongChao</footer>
      </div>
    )
  }
}

export default withRouter(BasicLayout)