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
    console.log('login', user)
    if (user.id) {
      this.props.history.push('/admin/home')
    }
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
    let { user } = store.getState()
    return (
      <Fragment>
        {
          !user.id && this.templateHtml()
        }
      </Fragment>
    )
  }
}

export default withRouter(LoginLayout)