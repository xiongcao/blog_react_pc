import React, { Component, Fragment } from 'react'
import { Form, Input, Icon, Button, message } from 'antd';

class CodeLogin extends Component {
  constructor(props){
    super(props)
    this.props.codeLoginRef(this)
  }

  onCodeLogin = () => {
    message.error("此功能暂未开放")
  }


  render() {
    return (
      <Form>
        <div className="verifyCode-login">
          <Form.Item validateStatus="" help="">
            <Input placeholder="手机号" prefix = {<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px' }}/>
          </Form.Item>
          <Form.Item validateStatus="" help="">
            <Input placeholder="验证码" prefix = {<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px', width: '200px' }}/>
            <Button size="large" style={{ marginLeft: '8px', paddingBottom: '2px' }}>获取验证码</Button>
          </Form.Item>
        </div>
      </Form>
    )
  }
}

export default CodeLogin