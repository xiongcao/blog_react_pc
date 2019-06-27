import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Route, Link, Redirect } from 'react-router-dom'
import { login } from '@/actions'

class Login extends Component {
  constructor(props){
    super(props)
  }

  login = () => {
    this.props.dispatch(login({
      username: '熊超',
      phone: '1572705403'
    }))
  }


  render() {
    return (
      <Fragment>
        <h2>#Login</h2>
        <button onClick = { this.login }>登录</button>
      </Fragment>
    )
  }
}

export default connect()(Login)