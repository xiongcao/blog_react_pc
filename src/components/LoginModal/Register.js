import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as Fetch from '@/libs/fetch';
import { message } from 'antd';
import { heandlLogin } from '@/actions/user'

class Register extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      password: '',
      phone: ''
    }
  }
  
  handleUsernameChange = (e) => {
    e.persist()
    this.setState({
      username: e.target.value
    })
  }

  async handleUsernameBlur () {
    let username = this.state.username
    if (username) {
      return await Fetch.get(`user/findUserByName?name=${username}`).then(async (res) => {
        if (res.code === 0) {
          message.error('该名称已被使用')
          return await false
        } else {
          return await true
        }
      })
		} else {
      message.error("请输入用户名")
      return await false
    }
  }
  
  handlePasswordChange = (e) => {
    e.persist()
    this.setState({
      password: e.target.value
    })
  }

  async handlePasswordBlur () {
    let password = this.state.password
    if (!password) {
      message.error('请输入密码')
      return await false
    } else {
      return await true
    }
  }

  handlePhoneChange = (e) => {
    e.persist()
    this.setState({
      phone: e.target.value
    })
  }

  async handlePhoneBlur () {
    let phone = this.state.phone
    if (phone) {
			if (phone.toString().length === 11) {
				if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
          message.error('手机号格式不正确')
          return await false
				} else {
          return await Fetch.get(`user/findUserByPhone?phone=${phone}`).then(async (res) => {
            if (res.code === 0) {
              message.error('该手机号已被使用')
              return await false
            } else {
              return await true
            }
          })
        }
			} else {
        message.error('请输入11位数的手机号')
        return await false
			}
		} else {
      message.error('请输入11位数的手机号')
      return await false
		}
  }

  async heandleRegister () {
    let { username, password, phone } = this.state
    let usernameFlag, passwordFlag, phoneFlag
    await this.handleUsernameBlur().then(res => { usernameFlag = res })
    if (!usernameFlag) {
      return
    }
    await this.handlePhoneBlur().then(res => { phoneFlag = res })
    if (!usernameFlag || !phoneFlag) {
      return
    }
    await this.handlePasswordBlur().then(res => { passwordFlag = res })
    if (usernameFlag && passwordFlag && phoneFlag) {
      Fetch.post(`user/register`, {
        name: username,
        password,
        phoneNumber: phone
      }).then(async (res) => {
        if (res.code === 0) {
          await  message.success('注册成功')
          await this.props.dispatch(heandlLogin(res.data))
          location.reload()
        }
      });
    }
  }

  render() {
    return (
      <div className="register-module">
        <input name="username" type="text" placeholder="请输入用户名" 
        onChange={this.handleUsernameChange.bind()} />

        <input name="phone" type="text" placeholder="请输入手机号" 
        onChange={this.handlePhoneChange.bind()} maxLength="11"/>

        <input name="password" type="password" placeholder="请输入密码" 
        onChange={this. handlePasswordChange.bind()} />
        <button onClick={this.heandleRegister.bind(this)}>注册</button>
      </div>
    );
  }
}

export default connect()(withRouter(Register))