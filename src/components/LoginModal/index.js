import React, { Component } from 'react';
import { Modal, Avatar, message } from 'antd'
import Login from './Login'
import Register from './Register'
import weibo from '@/assets/icon/weibo.svg'
import wechat from '@/assets/icon/wechat.svg'
import github from '@/assets/icon/github.svg'
import normal from '@/assets/img/normal.png'
import greeting from '@/assets/img/greeting.png'
import blindfold from '@/assets/img/blindfold.png'
import './index.less'

class LoginModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toggle: 1,
      cursorIndex: 0
    }
  }

  handleOk = e => {
    this.props.onOk(true)
  };

  handleCancel = e => {
    this.props.onCancel(false)
  };

  handleRegister = () => {
    this.setState({
      toggle: 2
    })
  }

  handleForgetPassword = () => {
    message.warning("暂未开放")
  }

  handleLogin = () => {
    this.setState({
      toggle: 1
    })
  }

  handleCurson = (e) => {
    this.setState({
      cursorIndex: e
    })
  }

  render() {
    let { visible } = this.props
    let { toggle, cursorIndex} = this.state
    return (
      <div>
        <Modal
          title={toggle === 1 ? '登录' : '注册'}
          className="login-modal"
          width={318}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={null}
        >
          {
            toggle === 1 && (
              <header>
                <img src={ cursorIndex === 0 ? normal : (cursorIndex === 1 ? greeting : blindfold)}/>
              </header>
            )
          }
          {
            toggle === 1 ? (
              <>
                <Login onChange={this.handleCurson.bind()}/>
                <div className="login-bottom">
                  <div>没有账号？ <span onClick={this.handleRegister.bind()}>注册</span></div>
                  <div><span onClick={this.handleForgetPassword.bind()}>忘记密码</span></div>
                </div>
              </>
            ) : (
              <>
                <Register onChange={this.handleCurson.bind()}/>
                <div className="register-bottom" onClick={this.handleLogin.bind()}>已有账号登录</div>
              </>
            )
          }
          <div className="login-modal-footer">
            <p>第三方账号登录</p>
            <div className="brand-logo">
              <Avatar size="small" shape="square" src={weibo}/>
              <Avatar size="small" shape="square" src={wechat}/>
              <Avatar size="small" shape="square" src={github}/>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default LoginModal;