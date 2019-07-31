import React, { Component, Fragment } from "react";
import { Form, Input, Icon, message } from 'antd';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as Fetch from '@/libs/fetch';
import { heandlLogin } from '@/actions/user'

import './index.less'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  validateName = (rule, value, callback) => {
    if (value) {
      Fetch.get(`user/findUserByName?name=${value}`).then((res) => {
        if (res.code === 0) {
          callback('该名称已被使用')
        } else {
          callback()
        }
      })
		} else {
			callback("请输入用户名")
		}
  };

  // validateEmail = (rule, value, callback) => {
  //   // Fetch.get(`user/findUserByPhone?phone=${value}`).then((res) => {
  //   //   if (res.code === 0) {
  //   //     callback('该名称已被使用')
  //   //   } else {
  //   //     callback()
  //   //   }
  //   // })
  // };
  
  validatePhoneNumber = (rule, value, callback) => {
    if (value) {
			if (value.toString().length === 11) {
				if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
					callback('手机号格式不正确')
				} else {
          Fetch.get(`user/findUserByPhone?phone=${value}`).then((res) => {
            if (res.code === 0) {
              callback('该手机号已被使用')
            } else {
              callback()
            }
          })
        }
			} else {
				callback('请输入11位数的手机号')
			}
		} else {
			callback('请输入11位数的手机号')
		}
	};

	uploadSuccess = (avatar) => {
		this.props.form.setFieldsValue({
			avatar
		})
  }
  
  onLogin = () => {
    this.props.history.push('/login')
  }

  handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFieldsAndScroll((err, values) => {
			values.birthday = values.birthday && values.birthday.format('YYYY-MM-DD')
      if (!err) {
				Fetch.post(`user/register`, values).then((res) => {
					if (res.code === 0) {
						message.success('注册成功')
            this.props.dispatch(heandlLogin(res.data))
            this.props.history.push("/admin/home")
					}
				});
      }
    });
	}

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="registerForm" onSubmit={this.handleSubmit}>
        <div className="account-login">
          <Form.Item hasFeedback>
            {
              getFieldDecorator('name', {
                rules: [
                  {
                    validator: this.validateName,
                  },
                ],
              })(<Input placeholder="请输入用户名" prefix = {<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px'}}/>)
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
              })(<Input.Password placeholder="请输入密码" prefix = {<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px'}}/>)
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('phoneNumber', {
                rules: [
                  {
                    validator: this.validatePhoneNumber,
                  },
                ],
              })(<Input placeholder="请输入手机号" prefix = {<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} maxLength={11} style = {{ height: '40px'}}/>)
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: '请输入正确的邮箱格式!',
                  }
                ]
              })(<Input placeholder="请输入邮箱" prefix = {<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} style = {{ height: '40px'}}/>)
            }
          </Form.Item>
          <div className="to-link">
            <div></div><div onClick={this.onLogin}>已有账号？去登录</div>
          </div>
          <Form.Item style={{marginBottom: 0}}>
            <button className="login-btn">注 册</button>
          </Form.Item>
        </div>
      </Form>
    )
  }
}

export default connect()(withRouter((Form.create({ name: 'register' })(Register))))