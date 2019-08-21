import React, { Component } from 'react';
import { message } from 'antd';
import { connect } from 'react-redux'

import { login } from '@/actions/user'

class Login extends Component {

  constructor(props){
    super(props)
    this.state = { 
      username: '',
      password: ''
    }
  }

  handleBlur = (e) => {
    this.props.onChange(e)
  }

  handleFoucus = (e) => {
    this.props.onChange(e)
  }

  handleUsernameChange = (e) => {
    e.persist()
    this.setState({
      username: e.target.value
    })
  }

  handlePasswordChange = (e) => {
    e.persist()
    this.setState({
      password: e.target.value
    })
  }

  keydownHandle = (e) => {
    e.persist()
    if (e.keyCode === 13) {
      this.handleLogin()
    }
  }

  handleLogin = (e) => {
    e.persist()
    let { username, password } = this.state
    if (!username) {
      message.error("请输入账号")
    } else if (!password) {
      message.error("请输入密码")
    } else {
      this.props.login({
        username, password
      });
    }
  }

  render() {
    return (
      <div className="login-module">
        <input name="username" type="text" placeholder="请输入用户名或手机号"
          onChange={this.handleUsernameChange.bind()} 
          onKeyDown={this.keydownHandle.bind()}
          onBlur={this.handleBlur.bind(this, 0)} 
          onFocus={this.handleFoucus.bind(this, 1)}/>
        <input name="password" type="password" placeholder="请输入密码" 
          onChange={this.handlePasswordChange.bind()} 
          onKeyDown={this.keydownHandle.bind()}
          onBlur={this.handleBlur.bind(this, 0)} 
          onFocus={this.handleFoucus.bind(this, 2)}/>
        <button onClick={this.handleLogin.bind()}>登录</button>
      </div>
    );
  }
}

const mapDispachToProps  = (dispatch, props) => ({
  login: (formValue) => {
    // 等待
    dispatch(login(formValue, props.history, 1));
  }
});

export default connect(null, mapDispachToProps)(Login);