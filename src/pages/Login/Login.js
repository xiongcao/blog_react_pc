import React, { Component, Fragment } from 'react'


import { AccountLogin, CodeLogin } from '@/components/index'

import '@/pages/Login/Login.less'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      loginType: 1
    }
  }

  login = () => {
    if (this.state.loginType == 1) {
      this.accountLogin.onLogin()
    } else {
      this.codeLogin.onCodeLogin()
    }
  }

  accountLoginRef = (ref) => {
    this.accountLogin = ref
  }
  codeLoginRef = (ref) => {
    this.codeLogin = ref
  }

  changeTabs = (type) => {
    this.setState({
      loginType: type
    })
  }

  render() {
    return (
      <div className="login">
        <div className="tabs">
          <div className={ this.state.loginType == 1 ? 'active' : '' } onClick={ this.changeTabs.bind(this, 1) }>账号密码登录</div>
          <div className={ this.state.loginType == 2 ? 'active' : '' } onClick={ this.changeTabs.bind(this, 2) }>验证码登录</div>
        </div>
        {
          this.state.loginType == 1 ? (
            <AccountLogin accountLoginRef={this.accountLoginRef}/>
          ) : (
            <CodeLogin codeLoginRef={this.codeLoginRef}/>
          )
        }
        <div className="to-link">
          <div className="forget-password">忘记密码</div><div className="register">注册账号</div>
        </div>
        <button className="login-btn" onClick= { this.login }>登录</button>
      </div>
    )
  }
}

export default Login