import React, { Component, Fragment } from 'react'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
import Home from '@pages/Home/Home.js'
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

import { handleJoinPath, filterLayout } from '@/router'
import store from '@/libs/store'
import { MyHeader } from '@/components/index'
import logo from '@/assets/img/logo.svg';

import './BasicLayout.less'

class BasicLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    };
  }

  componentWillMount () {
    let { user } = store.getState()
    if (!user.id) {
      this.props.history.push('/login')
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  filterLayout = (type) => {
    let _router = filterLayout('BasicLayout')
    handleJoinPath(_router, _router.path)
    if (type == 'link') {
      return this.eachAddLink(_router)
    } else {
      return this.eachAddRoute(_router)
    }
  }

  eachAddLink = (routers) => {
    return routers.children && routers.children.map((o, j) => {
      if (!o.hideInMenu) {
        if (o.children) {
          return (
            <SubMenu
              key = { o.path1 + j }
              title = {
                <span>
                  <Icon type = { o.icon } />
                  <span>{ o.title }</span>
                </span>
              }
            >
            { this.eachAddLink(o) }
            </SubMenu>
          )
        } else {
          return  (
            <Menu.Item key = { o.path1 }>
              <Link to = { o.path1 }>
                <Icon type = { o.icon } />
                <span>{ o.title }</span>
              </Link>
            </Menu.Item>
          )
        }
      }
    })
  }

  eachAddRoute = (routers) => {
    return routers.children && routers.children.map((o, j) => {
      if (!o.hideInMenu) {
        if (o.children) {
          return this.eachAddRoute(o)
        } else {
          return  (
            <Route path = { o.path1 } key = { o.path1 } component = { o.component }/>
          )
        }
      }
    })
  }

  render() {
    return (
      <Fragment>
        <Layout>
          <Sider
            style = {{
              height: '100vh'
            }}
            trigger = { null } collapsible collapsed = { this.state.collapsed }>
            <div className="logo">
              <img src={logo} alt="logo" />
              <h1>&nbsp;&nbsp;React</h1>
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              { this.filterLayout('link') }
            </Menu>
          </Sider>
          <Layout>
            <Header style = {{ background: '#fff', padding: 0 }}>
              <Icon
                className = "trigger"
                type = { this.state.collapsed ? 'menu-unfold' : 'menu-fold' }
                onClick = { this.toggle }
              />
              <MyHeader/>
            </Header>
            <Content
              style = {{
                margin: '24px 16px',
                padding: 24,
                background: '#fff',
                minHeight: 280,
              }}
            >
              <Route path="/admin" component={Home} exact />
              { this.filterLayout('route') }
            </Content>
          </Layout>
        </Layout>
      </Fragment>
    )
  }
}

export default withRouter(BasicLayout)