import React, { Component } from 'react';
import { Button, message } from 'antd'
import * as Fetch from '@/libs/fetch';

class Phone extends Component {
  constructor(props){
    super(props)
    this.state = {
      phoneFlag: false,
      phone: '',
      code: '',
      time: '60s',
      showTime: false
    }
  }

  UNSAFE_componentWillMount () {
    this.fnTimer()
  }

  confirmUpdate = () => {
    if (this.state.phoneFlag && this.state.code) {
      // 修改手机号
    }
  }

  async phoneBlur () {
    let phone = this.state.phone
    if (phone) {
			if (phone.toString().length === 11) {
				if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
          message.error('手机号格式不正确')
          this.state.phoneFlag = false
				} else {
          await Fetch.get(`user/findUserByPhone?phone=${phone}`).then((res) => {
            if (res.code === 0) {
              message.error('该手机号已被使用')
              this.state.phoneFlag = false
            } else {
              this.state.phoneFlag = true
            }
          })
        }
			} else {
        message.error('请输入11位数的手机号')
        this.state.phoneFlag = false
			}
		} else {
      message.error('请输入11位数的手机号')
      this.state.phoneFlag = false
		}
  }

  async sendCode () {
    await this.phoneBlur()
    if (this.state.phoneFlag) {
      Fetch.post(`verifyCode?phoneNumber=${this.state.phone}`).then(async (res) => {
        if (res.code === 0) {
          localStorage.setItem("timer", 60)
          message.success('发送成功')
          this.setState({
            showTime: true,
            phoneFlag: false
          }, () => {
            this.fnTimer()
          })
        }
      })
    }
  }

  fnTimer () {
    let timer = localStorage.getItem("timer")
    if (timer && timer >= 0) {
      this.setState({
        showTime: true
      }, () => {
        let interval = setInterval(() => {
          this.setState({
            time: timer + 's'
          }, () => {
            timer-=1
            localStorage.setItem("timer", timer)
            if (timer === 0) {
              this.setState({
                phoneFlag: true
              })
              clearInterval(interval)
            }
          })
        }, 1000)
      })
    }
  }

  codeChange = (e) => {
    e.persist()
    this.setState({
      code: e.target.value
    })
  }

  phoneChange = (e) => {
    e.persist()
    this.setState({
      phone: e.target.value
    })
  }

  render() {
    let { showTime, time } = this.state
    return (
      <div className="phone">
        <div className="header">
          <span className="title">修改手机</span>
        </div>
        <div className="form">
          <div className="input">
            <input name="phone" placeholder="请输入新手机号" onChange={this.phoneChange.bind()}/>
            <input name="code" placeholder="请输入验证码" onChange={this.codeChange.bind()} maxLength="6"/>
            <span className="sendCode" onClick={this.sendCode.bind(this)}>{ showTime ? time : '发送验证码'}</span>
            <Button type="primary" size="large" onClick={this.confirmUpdate.bind()}>确认</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Phone;