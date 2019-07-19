import React, { Component } from 'react'
import { Form, Input, Icon, message } from 'antd';
import { connect } from 'react-redux'
// import { withRouter } from 'react-router-dom'

import { login } from '@/actions/user'

class AccountLogin extends Component {
  constructor(props){
    super(props)
    this.props.accountLoginRef(this)
    this.state = {
    }
  }

  onLogin = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.login(values);
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <div className="account-login">
          <Form.Item hasFeedback>
            {
              getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名!',
                  }
                ],
              })(<Input placeholder="用户名" prefix = {<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px'}}/>)
            }
          </Form.Item>
          <Form.Item hasFeedback>
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码!',
                  }
                ],
              })(<Input.Password placeholder="密码" prefix = {<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px'}}/>)
            }
          </Form.Item>
        </div>
      </Form>
    )
  }
}

const mapDispachToProps  = (dispatch, props) => ({
  login: (formValue) => {
    // 等待
    dispatch(login(formValue, props.history));
  }
});

export default connect(null, mapDispachToProps)(Form.create({ name: 'login' })(AccountLogin))