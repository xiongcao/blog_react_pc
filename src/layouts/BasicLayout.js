import React, { Component, Fragment } from 'react'
import { withRouter, Route, Link, Redirect } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

import { handleJoinPath, filterLayout } from '@/router'
import store from '@/libs/store'

import './BasicLayout.less'

class BasicLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      user: props.user
    };

    if (!this.state.user) { // 未登录
      this.props.history.push({ pathname: `/login` })
    }
    store.subscribe(() => {
      let { user } = store.getState()
      this.setState({
        user
      })
    })
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
        {
          this.state.user && (
            <Layout>
              <Sider
                style = {{
                  height: '100vh'
                }}
                trigger = { null } collapsible collapsed = { this.state.collapsed }>
                <div className="logo" />
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
                </Header>
                <Content
                  style = {{
                    margin: '24px 16px',
                    padding: 24,
                    background: '#fff',
                    minHeight: 280,
                  }}
                >
                  { this.filterLayout('route') }
                </Content>
              </Layout>
            </Layout>
          )
        }
      </Fragment>
    )
  }
}

export default withRouter(BasicLayout)