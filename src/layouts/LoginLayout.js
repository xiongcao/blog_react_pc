import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import Login from '@/pages/login/login.js'
import { Register } from '@/components/index'
import store from '@/libs/store'
import '@/layouts/LoginLayout.less'


class LoginLayout extends Component {
  constructor(props){
    super(props)
    this.state = { 
      path: this.props.match.path
    };
  }

  componentWillMount () {
    let { user } = store.getState()
    if (user.id) {
      this.props.history.push('/admin/home')
    }
  }

  render() {
    let { path } = this.state
    return (
      <Fragment>
        <div className="login-layout">
          <div className="login-box"></div>
          <div className="layout-content">
            <div className="title">{path === '/login' ? 'Panda Blog Admin' : '注 册'}</div>
            {
              path === '/login' ? (
                <Login/>
              ) : (
                <Register/>
              )
            }
          </div>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(LoginLayout)