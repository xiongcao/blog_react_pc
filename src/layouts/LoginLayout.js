import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route } from 'react-router-dom'
import Login from '@/pages/Login/Login.js'
import store from '@/libs/store'

import '@/layouts/LoginLayout.less'


class LoginLayout extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: props.user
    };

 
    store.subscribe(() => {
      let { user } = store.getState()
      if (user) { // 已登录
        this.props.history.push({ pathname: `/admin/home` })
      }
      this.setState({
        user
      })
    })
  }

  templateHtml = () => {
    return (
      <div className="login-layout">
        <div className="login-box"></div>
        <div className="layout-content">
          <div className="title">Panda Blog Admin</div>
          <Route path = '/login' component = { Login } />
        </div>
      </div>
    )
  }

  render() {
    return (
      <Fragment>
        {
          !this.state.user && this.templateHtml()
        }
      </Fragment>
    )
  }
}

export default withRouter(LoginLayout)