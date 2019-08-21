import React, { Component } from 'react'
import { withRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Home from '@pages/frontend/index/index'
import EssayList from '@pages/frontend/essay/essayList'
import EssayDetail from '@pages/frontend/essay/essayDetail'
import Archive from '@pages/frontend/archive/archive'
import store from '@/libs/store'
import { oss } from '@/libs/publicPath.js'
import { Menu, Icon, Button, Avatar, Dropdown } from 'antd';
import { LoginModal } from '@/components'
import { heandlOutLogin } from '@/actions/user'
import logo from '@/assets/img/logo.svg';
import lingdang from '@/assets/icon/lingdang.svg';
import lingdang_active from '@/assets/icon/lingdang_active.svg';

import './BasicLayout.less'

class BasicLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      user: store.getState().user,
      notification: lingdang,
      current: 'index',
      loginVisible: false
    };
  }

  componentWillMount () {
    let pathname = this.props.location.pathname
    let paths = pathname.split("/")
    if (paths[1] === 'frontend' && !paths[2]) {
      this.setState({
        current: 'index'
      })
    } else {
      this.setState({
        current: paths[2]
      })
    }
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

  login = () => {
    this.setState({
      loginVisible: true,
    });
  }

  handleOk = e => {
    this.setState({
      loginVisible: e,
    });
  };

  handleCancel = e => {
    this.setState({
      loginVisible: e,
    });
  };

  handleLoginOut = () => {
    localStorage.clear()
    this.props.dispatch(heandlOutLogin())
    this.props.history.push('/')
  }


  render() {
    let { user, notification, current, loginVisible } = this.state
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <span>写文章</span>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon  type="logout"/><span onClick={this.handleLoginOut.bind()}>退出登录</span>
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
                <Link to="/frontend/index">
                  <Icon type="home" /> 首页
                </Link>
              </Menu.Item>
              <Menu.Item key="essay">
                <Link to="/frontend/essay">
                  <Icon type="ordered-list" /> 文章
                </Link>
              </Menu.Item>
              <Menu.Item key="archive">
                <Link to="/frontend/archive">
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
                  <>
                    {/* <Button icon="profile" type="link" onClick={this.geToEssayPage}>写文章</Button> |  */}
                    <Button type="link" onClick={this.login.bind()}>登录 · 注册</Button>
                    <LoginModal visible={loginVisible} onOk={this.handleOk} onCancel={this.handleCancel}/>
                  </>
                )
              }
            </div>
          </nav>
        </header>
        <article>
          <Route path="/frontend" render={() => <Redirect to='/frontend/index'></Redirect>} component={Home} exact/>
          <Route path="/frontend/index" component={Home}/>
          <Route path="/frontend/essay" component={EssayList}/>
          <Route path="/frontend/essayDetail/:id" component={EssayDetail}/>
          <Route path="/frontend/archive" component={Archive}/>
        </article>
        <footer>全栈修炼 ©2018 Created by XiongChao</footer>
      </div>
    )
  }
}

export default connect()(withRouter(BasicLayout))