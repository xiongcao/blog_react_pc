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
      phone: '',
      usernameFlag: false,
      passwordFlag: false,
      phoneFloag: false
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
      await Fetch.get(`user/findUserByName?name=${username}`).then((res) => {
        if (res.code === 0) {
          message.error('该名称已被使用')
          this.state.usernameFlag = false
        } else {
          this.state.usernameFlag = true
        }
      })
		} else {
      message.error("请输入用户名")
      this.state.usernameFlag = false
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
      this.state.passwordFlag = false
    } else {
      this.state.passwordFlag = true
    }
  }

  handlePhoneChange = (e) => {
    e.persist()
    this.setState({
      phone: e.target.value
    })
  }

  async handlePhonelur () {
    let phone = this.state.phone
    if (phone) {
			if (phone.toString().length === 11) {
				if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
          message.error('手机号格式不正确')
          this.state.phoneFloag = false
				} else {
          await Fetch.get(`user/findUserByPhone?phone=${phone}`).then((res) => {
            if (res.code === 0) {
              message.error('该手机号已被使用')
              this.state.phoneFloag = false
            } else {
              this.state.phoneFloag = true
            }
          })
        }
			} else {
        message.error('请输入11位数的手机号')
        this.state.phoneFloag = false
			}
		} else {
      message.error('请输入11位数的手机号')
      this.state.phoneFloag = false
		}
  }

  async heandleRegister () {
    let { usernameFlag, passwordFlag, phoneFloag, username, password, phone } = this.state
    await this.handleUsernameBlur()
    await usernameFlag && this.handlePasswordBlur()
    await usernameFlag && passwordFlag && this.handlePhonelur()
    if (usernameFlag && passwordFlag && phoneFloag) {
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
        onBlur={this.handleUsernameBlur.bind(this)}
        onChange={this.handleUsernameChange.bind()} />

        <input name="phone" type="text" placeholder="请输入手机号" 
        onBlur={this.handlePhonelur.bind(this)}
        onChange={this.handlePhoneChange.bind()} maxLength="11"/>

        <input name="password" type="password" placeholder="请输入密码" 
        onBlur={this.handlePasswordBlur.bind(this)}
        onChange={this. handlePasswordChange.bind()} />
        <button onClick={this.heandleRegister.bind(this)}>注册</button>
      </div>
    );
  }
}

export default connect()(withRouter(Register))