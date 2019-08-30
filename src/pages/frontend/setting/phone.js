import React, { Component } from 'react';
import { Button, message } from 'antd'

class Phone extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  confirmUpdate = () => {

  }

  render() {
    return (
      <div className="phone">
        <div className="header">
          <span className="title">修改手机</span>
        </div>
        <div className="form">
          <div className="input">
            <input name="phone" placeholder="请输入新手机号"/>
            <input name="code" placeholder="请输入验证码"/>
            <span>发送验证码</span>
            <Button type="primary" size="large" onClick={this.confirmUpdate.bind()}>确认</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Phone;