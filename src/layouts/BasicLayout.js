import React, { Component } from 'react'
import { withRouter, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Home from '@pages/frontend/index/index'
import EssayList from '@pages/frontend/essay/essayList'
import EssayDetail from '@pages/frontend/essay/essayDetail'
import Archive from '@pages/frontend/archive/archive'
import Personal from '@pages/frontend/personal/personal'
import Setting from '@pages/frontend/setting/setting'
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

    store.subscribe(() => {
      this.setState({
        user: store.getState().user
      })
    })
  }

  UNSAFE_componentWillReceiveProps () {
    let userId = this.state.user.id
    let pathname = this.props.history.location.pathname
    let paths = pathname.split("/")
    if (!userId && paths[1] === 'frontend' && paths[2] && paths[2] !== 'index' && paths[2] !== 'essay' && paths[2] !== 'archive' && paths[2] !== 'essayDetail') { // 如果不是导航条的这几个页面，则跳转到首页，并弹出登录框
      this.props.history.push("/frontend")
    } else {
      this.setState({
        current: paths[2]
      })
    }

  }

  UNSAFE_componentWillMount () {
    let userId = this.state.user.id
    let pathname = this.props.location.pathname
    let paths = pathname.split("/")
    if (paths[1] === 'frontend' && !paths[2]) {
      this.setState({
        current: 'index'
      })
    } else {
      if (!userId && paths[1] === 'frontend' && paths[2] && paths[2] !== 'index' && paths[2] !== 'essay' && paths[2] !== 'archive' && paths[2] !== 'essayDetail') { // 如果不是导航条的这几个页面，则跳转到首页，并弹出登录框
        this.props.history.push("/frontend")
      }
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
      <Menu className="frontend-user-menu">
        <Menu.Item key="essay">
          <Link to="/admin/essayEdit/-1">
            <Icon type="edit"/><span>写文章</span>
          </Link>
        </Menu.Item>
        <span className="lineBar"></span>
        <Menu.Item key="follow">
          <Link to="/frontend/personal/follow">
            <Icon type="eye"/><span>我的关注</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="collect">
        <Link to="/frontend/personal/collect">
          <Icon type="star"/><span>我的收藏</span>
        </Link>
        </Menu.Item>
        <Menu.Item key="user">
          <Link to="/frontend/personal/personal"><Icon type="user"/><span>个人中心</span></Link>
        </Menu.Item>
        <Menu.Item key="setting">
          <Link to="/frontend/setting/index">
            <Icon type="setting"/><span>账号设置</span>
          </Link>
        </Menu.Item>
        <span className="lineBar"></span>
        <Menu.Item key="manage">
          <Link to="/admin"><Icon type="dashboard"/><span>后台管理</span></Link>
        </Menu.Item>
        <Menu.Item key="logout" onClick={this.handleLoginOut.bind()}>
          <Icon type="logout"/>退出登录
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
              <Menu.Item key="project">
                <Link to="/frontend/project">
                  <Icon type="question-circle" /> 项目
                </Link>
              </Menu.Item>
              {/* <Menu.Item key="message">
                <Link to="/index">
                  <Icon type="message" /> 留言
                </Link>
              </Menu.Item> */}
              <Menu.Item key="about">
                <Link to="/frontend/about">
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
                      </div>
                    </Dropdown>
                  </>
                ) : (
                  <>
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
          <Route path="/frontend/personal/:id" component={Personal}/>
          <Route path="/frontend/setting" component={Setting}/>
          <Route path="/frontend/about" component={EssayDetail}/>
        </article>
        <footer>全栈修炼 ©2018 Created by XiongChao</footer>
      </div>
    )
  }
}

export default connect()(withRouter(BasicLayout))