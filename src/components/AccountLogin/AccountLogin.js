import React, { Component, Fragment } from 'react'
import { Form, Input, Icon, message } from 'antd';

import { loginIn } from '@/api/user'

class AccountLogin extends Component {
  constructor(props){
    super(props)
    this.state = {
      usernameTips: '',
      passwordTips: '',
      username: null,
      password: null
    }
  }

  inputChange = (e) => {
    e.persist()
    let name = e.target.name
    let value = e.target.value
    this.setState({
      [name]: value
    })
    if (value) {
      if (name == 'username') {
        this.setState({
          usernameTips: ''
        })
      } else {
        this.setState({
          passwordTips: ''
        })
      }
    }
  }

  onLogin = () => {
    let checkFlag = this.inputCheck()
    if (checkFlag) {
      // 执行登录请求操作
      loginIn(this.state.username, this.state.password).then((res) => {
        if (res.code == 0) {
          message.success('登录成功')
        } else {
          message.error(res.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  inputBlur = () => {
    this.inputCheck()
  }

  inputCheck = () => {
    if (this.state.username && this.state.password) {
      this.setState({
        usernameTips: '',
        passwordTips: ''
      })
      return true
    } else if (this.state.username) {
      this.setState({
        passwordTips: '请输入密码'
      })
      return false
    } else if (this.state.password) {
      this.setState({
        usernameTips: '请输入用户名'
      })
      return false
    } else {
      this.setState({
        usernameTips: '请输入用户名',
        passwordTips: '请输入密码'
      })
      return false
    }
  }

  render() {
    return (
      <Form>
        <div className="account-login">
          <Form.Item validateStatus={ this.state.usernameTips ? 'error' : '' } help={ this.state.usernameTips }>
            <Input placeholder="用户名" name="username" onBlur={ this.inputBlur } onChange={ this.inputChange } prefix = {<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px'}}/>
          </Form.Item>
          <Form.Item validateStatus={ this.state.passwordTips ? 'error' : '' } help={ this.state.passwordTips }>
            <Input placeholder="密码" name="password" onBlur={ this.inputBlur } onChange={ this.inputChange } prefix = {<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px'}}/>
          </Form.Item>
        </div>
      </Form>
    )
  }
}

export default AccountLogin