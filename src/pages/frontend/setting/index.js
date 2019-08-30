import React, { Component } from 'react';
import { Icon } from 'antd'
import { Link } from 'react-router-dom'

class Index extends Component {
  render() {
    return (
      <div className="index">
        <div className="header">
          <span className="title">账号评分： <span>90分</span> 正常</span>
        </div>
        <div className="account-item">
          <span className="name">定期修改密码</span>
          <span className="tips warn"><Icon type="warning" theme="twoTone" twoToneColor="#f5a623"/> 存在风险</span>
          <span className="btn"><Link to="/frontend/setting/password">立即修改</Link></span>
        </div>
        <div className="account-item">
          <span className="name">绑定安全手机</span>
          <span className="tips success"><Icon type="check-circle" theme="twoTone" twoToneColor="#7ed321" /> 正常</span>
        </div>
        <div className="account-item">
          <span className="name">绑定安全邮箱</span>
          <span className="tips success"><Icon type="check-circle" theme="twoTone" twoToneColor="#7ed321" /> 正常</span>
        </div>
        <div className="account-item">
          <span className="name">绑定第三方账号</span>
          <span className="tips success"><Icon type="check-circle" theme="twoTone" twoToneColor="#7ed321" /> 正常</span>
        </div>
        <div className="account-item">
          <span className="name">登录日志</span>
          <span className="tips success"><Icon type="check-circle" theme="twoTone" twoToneColor="#7ed321" /> 正常</span>
        </div>
      </div>
    );
  }
}

export default Index;