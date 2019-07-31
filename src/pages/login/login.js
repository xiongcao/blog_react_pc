import React, { Component } from 'react'
import { message } from 'antd'
import { withRouter } from 'react-router-dom'
import { AccountLogin, CodeLogin } from '@/components/index'

import '@/pages/login/login.less'

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

  register = () => {
    // this.props.onRegister()
    this.props.history.push('/register')
  }

  forgetPassword = () => {
    message.error("此功能暂未开发")
  }

  render() {
    let { loginType } = this.state
    return (
      <div className="login">
        <div className="tabs">
          <div className={ loginType == 1 ? 'active' : '' } onClick={ this.changeTabs.bind(this, 1) }>账号密码登录</div>
          <div className={ loginType == 2 ? 'active' : '' } onClick={ this.changeTabs.bind(this, 2) }>验证码登录</div>
        </div>
        {
          loginType == 1 ? (
            <AccountLogin accountLoginRef={this.accountLoginRef} history={this.props.history}/>
          ) : (
            <CodeLogin codeLoginRef={this.codeLoginRef}/>
          )
        }
        <div className="to-link">
          <div className="forget-password" onClick={this.forgetPassword}>忘记密码</div><div className="register" onClick={this.register.bind()}>注册账号</div>
        </div>
        <button className="login-btn" onClick= { this.login }>登 录</button>
      </div>
    )
  }
}

export default withRouter(Login)