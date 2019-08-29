import React, { Component } from 'react';
import { Button, message } from 'antd'
import * as Fetch from '@/libs/fetch';

class Password extends Component {
  constructor(props){
    super(props)
    this.state = {
      old_pwd: '',
      new_pwd: '',
      confirm_pwd: ''
    }
  }

  oldChange = (e) => {
    e.persist()
    this.setState({
      old_pwd: e.target.value
    })
  }

  newChange = (e) => {
    e.persist()
    this.setState({
      new_pwd: e.target.value
    })
  }

  confirmChange = (e) => {
    e.persist()
    this.setState({
      confirm_pwd: e.target.value
    })
  }

  diffPwd () {
    if (this.state.new_pwd !== this.state.confirm_pwd) {
      message.error("两次密码不一致")
      return false
    }
    return true
  }

  check = () => {
    if (!this.state.old_pwd) {
      message.error("请输入当前密码")
      return false
    }
    if (!this.state.new_pwd) {
      message.error("请输入新密码")
      return false
    }
    return true
  }

  save = (e) => {
    if (this.check() && this.diffPwd()) {
      Fetch.post(`user/updatePassword`, {
        params: {
          oldPwd: this.state.old_pwd,
          newPwd: this.state.new_pwd
        }
      }).then(async (res) => {
        if (res.code === 0) {
          message.success('修改成功')
        }
      });
    }
  }

  render() {
    let { old_pwd, new_pwd, confirm_pwd } = this.state
    return (
      <div className="password">
        <div className="header">
          <span className="title">修改密码</span>
        </div>
        <div className="form">
          <div className="label">
            <label>当前密码</label>
            <label>新密码</label>
            <label>确认密码</label>
          </div>
          <div className="input">
            <input name="old" value={old_pwd} onChange={this.oldChange.bind()} placeholder="请输入当前密码"/>
            <input name="new" value={new_pwd} onChange={this.newChange.bind()} placeholder="请输入新密码"/>
            <input name="confirm" value={confirm_pwd} onChange={this.confirmChange.bind()} placeholder="请再输一次"/>
            <Button type="primary" size="large" onClick={this.save.bind()}>保存</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Password;