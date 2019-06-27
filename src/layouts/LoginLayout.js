import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route } from 'react-router-dom'
import Login from '@pages/Login/Login.js'
import store from '@/libs/store'


class LoginLayout extends Component {
  constructor(props){
    super(props)

    this.state = {
      user: props.user
    };

    if (!this.state.user) { // 未登录
      this.props.history.push({ pathname: `/login` })
    }
    store.subscribe(() => {
      let { user } = store.getState()
      console.log(111111111111, user)
      this.setState({
        user
      })
    })
  }

  render() {
    return (
      <Fragment>
        {
          !this.state.user && (
            <Route path = '/login' component = { Login } />
          )
        }
      </Fragment>
    )
  }
}

export default withRouter(LoginLayout)