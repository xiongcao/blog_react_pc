import React, { Component } from 'react';
import { Modal, Avatar, message } from 'antd'

import weibo from '@/assets/icon/weibo.svg'
import wechat from '@/assets/icon/wechat.svg'
import github from '@/assets/icon/github.svg'
import qq from '@/assets/icon/qq.svg'

class BindAccount extends Component {
  render() {
    return (
      <div className="bindaccount">
        <div className="header">
          <span className="title">绑定登录账号</span>
        </div>
        <div className="bind-item">
          <div className="name"><Avatar size="small" shape="square" src={wechat}/>微信</div>
          <div className="nickname">沙漏｀漏了一年又一年.ぢ</div>
          <div className="btn btn-unbind">解绑</div>
        </div>
        <div className="bind-item">
          <div className="name"><Avatar size="small" shape="square" src={qq}/>QQ</div>
          <div className="nickname">你就是我的小星星</div>
          <div className="btn btn-unbind">解绑</div>
        </div>
        <div className="bind-item">
          <div className="name"><Avatar size="small" shape="square" src={github}/>GitHub</div>
          <div className="nickname"></div>
          <div className="btn btn-bind">绑定</div>
        </div>
        <div className="bind-item">
          <div className="name"><Avatar size="small" shape="square" src={weibo}/>新浪微博</div>
          <div className="nickname"></div>
          <div className="btn btn-bind">绑定</div>
        </div>
      </div>
    );
  }
}

export default BindAccount;