import React, { Component, Fragment } from 'react'
import { withRouter, Route } from 'react-router-dom'
import Login from '@/pages/Login/Login.js'
import store from '@/libs/store'
import '@/layouts/LoginLayout.less'


class LoginLayout extends Component {
  constructor(props){
    super(props)
    this.state = { };
  }

  componentWillMount () {
    let { user } = store.getState()
    if (user.id) {
      this.props.history.push('/admin/home')
    }
  }

  render() {
    return (
      <Fragment>
        <div className="login-layout">
          <div className="login-box"></div>
          <div className="layout-content">
            <div className="title">Panda Blog Admin</div>
            <Login/>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(LoginLayout)