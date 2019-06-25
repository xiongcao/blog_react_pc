import React, { Component, Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

import routerConfig from '@/router/router'

import './BasicLayout.less'

class BasicLayout extends Component {
  constructor(props){
    super(props)
    this.state = {
      collapsed: false,
      rootPath: ''
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  filterLayout = (type) => {
    let routers = []
    let _rootPath
    try {
      routerConfig.forEach((router, i) => {
        if(router.name == 'BasicLayout'){
          routers = router
          this.state.rootPath = router.path
          throw new Error("EndIterative");
        }
      })
    } catch (e) {
      if(e.message!='EndIterative'){
        throw e;
      }
    }
    if (type == 'link') {
      return this.eachAddLink(routers)
    } else {
      return this.eachAddRoute(routers)
    }
  }

  eachAddLink = (routers) => {
    return routers.children && routers.children.map((o, j) => {
      if (!o.hideInMenu) {
        if (o.children) {
          return (<SubMenu
              key={o.path}
              title={
                <span>
                  <Icon type={o.icon} />
                  <span>{o.name}</span>
                </span>
              }
            >
            {
              this.eachAddLink(o)
            }
          </SubMenu>)
        } else {
          return (
            <Menu.Item key={o.path}>
              <Link to={this.state.rootPath + o.path}>
                <Icon type={o.icon} />
                <span>{o.name}</span>
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
          return (
            <Route path={o.path} key={j} component = {o.component}/>
          )
        }
      }
    })
  }

  render() {
    return (
      <Layout>
        <Sider
          style={{
            height: '100vh'
          }}
          trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            { this.filterLayout('link') }
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
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
}

export default BasicLayout