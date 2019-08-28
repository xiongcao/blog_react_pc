/**
 * 路由前置导航守卫
 */

import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'

import { handleJoinPath, filterLayout } from '@/router'

class BeforRouter extends Component {
  constructor(props) {
    super(props)
  }

  filterLayout = (type) => {
    let _router = filterLayout('AdminLayout')
    handleJoinPath(_router, _router.path)
    if (type == 'link') {
      return this.eachAddLink(_router)
    } else {
      return this.eachAddRoute(_router)
    }
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
  UNSAFE_componentWillMount() {
    console.log('路由跳转前的拦截', this.props)
  }

  render () {
    return (
      <Fragment>
        { this.filterLayout('route') }
      </Fragment>
    )
  }
}

export default BeforRouter