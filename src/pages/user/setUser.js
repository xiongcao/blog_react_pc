import React, { Component, Fragment } from 'react'
import {connect} from 'react-redux'
import { Form, Input, Button, message, DatePicker, Radio } from 'antd';
import * as Fetch from '@/libs/fetch';
import moment from 'moment';
import { heandlLogin } from '@/actions/user'
import PageTitle from '@/components/PageTitle'
import UploadImage from '@/components/UploadImage'
import store from '@/libs/store.js';
class setUser extends Component {
  constructor(props){
		super(props)
    this.state = {
			confirmDirty: false,
			user: store.getState().user,
			userForm: store.getState().user
		}
  }


  componentDidMount () {
		let { name, phoneNumber, nickname, avatar, remark, email } = this.state.user
		this.props.form.setFieldsValue({
			name, phoneNumber: phoneNumber, nickname, avatar, remark, email
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFieldsAndScroll((err, values) => {
			values.birthday = values.birthday && values.birthday.format('YYYY-MM-DD')
			values = Object.assign({}, this.state.userForm, values)
      if (!err) {
				Fetch.post(`user/save`, values).then((res) => {
					if (res.code === 0) {
						message.success('保存成功')
						this.props.dispatch(heandlLogin(values))
					}
				});
      }
    });
	}

	handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};
	
	compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('您输入的两个密码不一致!');
    } else {
      callback();
    }
  };

	validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
	};
	
	validatePhoneNumber = (rule, value, callback) => {
    if (value) {
			if (value.toString().length === 11) {
				if (!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(value)) {
					callback('手机号格式不正确')
				} else {
					callback()
				}
			} else {
				callback('请输入11位数的手机号')
			}
		} else {
			callback()
		}
	};

	uploadSuccess = (avatar) => {
		this.props.form.setFieldsValue({
			avatar
		})
	}

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 4 },
        sm: { span: 16 },
      }
		};
		const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 1,
          offset: 2,
        },
      }
		};
		const { getFieldDecorator } = this.props.form;
    return (
      <div className='setUser'>
			<PageTitle>个人设置</PageTitle>
			<Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="用户名">
					{
						getFieldDecorator('name', {initialValue: this.state.user.name})(<Input disabled/>)
					}
        </Form.Item>
				<Form.Item label="密码" hasFeedback>
					{
						getFieldDecorator('password', {
							rules: [
								{
									required: true,
									message: '请输入密码!',
								},
								{
									validator: this.validateToNextPassword,
								},
							],
						})(<Input.Password onBlur={this.handleConfirmBlur}/>)
					}
        </Form.Item>
				<Form.Item label="确认密码" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请输入密码!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
				<Form.Item label="头像">
					{
						getFieldDecorator('avatar')(
							<Fragment>
								<Input hidden/>
								<UploadImage imagePath={this.state.user.avatar} folder="avatar" uploadSuccess={this.uploadSuccess.bind()} />
							</Fragment>
						)
					}
        </Form.Item>
				<Form.Item label="生日">
					{
						getFieldDecorator('birthday', {initialValue: moment(this.state.user.birthday)})(
							<DatePicker onChange={this.changeBirthday} style={{width: 280}}/>
						)
					}
        </Form.Item>
				<Form.Item label="性别">
					{
						getFieldDecorator('gender', {initialValue: this.state.user.gender})(
							<Radio.Group>
								<Radio value={0}>男</Radio>
								<Radio value={1}>女</Radio>
								<Radio value={2}>未知</Radio>
							</Radio.Group>
						)
					}
        </Form.Item>
				<Form.Item label="邮箱">
					{
						getFieldDecorator('email', {
							rules: [
								{
									type: 'email',
									message: '请输入正确的邮箱格式!',
								},
							],
						})(<Input style={{width: 280}}/>)
					}
        </Form.Item>
				<Form.Item label="手机号">
					{
						getFieldDecorator('phoneNumber', {
							rules: [
								{
									validator: this.validatePhoneNumber,
								},
							],
						})(<Input maxLength={11} style={{width: 280}}/>)
					}
        </Form.Item>
				<Form.Item label="昵称">
					{
						getFieldDecorator('nickname')(<Input/>)
					}
        </Form.Item>
				<Form.Item label="个人简介">
					{
						getFieldDecorator('remark')(<Input/>)
					}
        </Form.Item>
				<Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">保存</Button>
        </Form.Item>
			</Form>
		</div>
    )
  }
}

export default connect()(Form.create({ name: 'setUserInfo' })(setUser))