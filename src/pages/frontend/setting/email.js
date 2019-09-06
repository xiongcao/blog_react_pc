import React, { Component } from 'react';
import { Button, message } from 'antd'

class Eamil extends Component {

  constructor(props){
    super(props)
  }

  confirmUpdate = () => {

  }
  
  render() {
    return (
      <div className="email">
        <div className="header">
          <span className="title">修改邮箱</span>
        </div>
        <div className="form">
          <div className="input">
            <input name="phone" placeholder="请输入新邮箱"/>
            <input name="code" placeholder="请输入验证码"/>
            <button className="sendCode">发送验证码</button>
            <Button type="primary" size="large" onClick={this.confirmUpdate.bind()}>确认</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Eamil;