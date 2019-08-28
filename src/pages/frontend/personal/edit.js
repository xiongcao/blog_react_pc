import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Upload, Avatar, Modal, Form, Input, Button, DatePicker, Radio, Cascader, message } from 'antd'
import * as Fetch from '@/libs/fetch';
import options from '@/utils/area.js'
import { heandlLogin } from '@/actions/user'
import { api, oss } from '@/libs/publicPath.js'
import moment from 'moment'
import UploadImage from '@/components/UploadImage'
import store from '@/libs/store'

class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      userInfo: {},
      visible: false
    }

    store.subscribe(() => {
      this.setState({
        userInfo: store.getState().user
      })
    })
  }

  UNSAFE_componentWillReceiveProps (props) {
    this.setState({
      userInfo: Object.assign({}, props.userInfo)
    })
  }

  handleOk = e => {
    this.setState({
      visible: false
    })
  };

  handleCancel = e => {
    this.setState({
      visible: false
    })
  };


  handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFieldsAndScroll((err, values) => {
      values.birthday = values.birthday && values.birthday.format('YYYY-MM-DD')
      let address = values.address
      if (address.length !== 0) {
        values.province = address[0]
        values.city = address[1]
        values.area = address[2]
      }
      values = Object.assign({}, this.state.userInfo, values)
      if (!err) {
				this.saveUserInfo(values)
      }
    });
  }

  saveUserInfo (values) {
    Fetch.post(`user/save`, values).then((res) => {
      if (res.code === 0) {
        message.success('保存成功')
        this.props.dispatch(heandlLogin(values))
        this.setState({visible: false})
      }
    });
  }
  
  uploadSuccess = (avatar) => {
    let user = Object.assign({}, this.state.userInfo, {avatar})
    this.saveUserInfo(user)
  }
  
  renderUserModal = () => {
    let { userInfo, visible } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 20 }
      }
		};
		const tailFormItemLayout = {
      wrapperCol: {
        sm: {
          span: 2,
          offset: 4
        }
      }
		};
		const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title='修改个人信息'
        className="user-modal"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="昵称">
          {
            getFieldDecorator('nickname', {initialValue: userInfo.nickname})(<Input style={{width: '278px'}}/>)
          }
          </Form.Item>
          <Form.Item label="生日">
            {
              getFieldDecorator('birthday', {initialValue: moment(userInfo.birthday)})(
                <DatePicker style={{width: '278px'}}/>
              )
            }
          </Form.Item>
          <Form.Item label="性别">
            {
              getFieldDecorator('gender', {initialValue: userInfo.gender})(
                <Radio.Group>
                  <Radio value={0}>男</Radio>
                  <Radio value={1}>女</Radio>
                  <Radio value={2}>未知</Radio>
                </Radio.Group>
              )
            }
          </Form.Item>
          <Form.Item label="座右铭">
          {
            getFieldDecorator('motto', {initialValue: userInfo.motto})(<Input/>)
          }
          </Form.Item>
          <Form.Item label="地区">
          {
            getFieldDecorator('address', {initialValue: [userInfo.province, userInfo.city, userInfo.area]})(
            <Cascader
              options={options}
              showSearch
              placeholder="请选择地区"
            />)
          }
          </Form.Item>
          <Form.Item label="行业">
          {
            getFieldDecorator('industry', {initialValue: userInfo.industry})(<Input/>)
          }
          </Form.Item>
          <Form.Item label="职位">
          {
            getFieldDecorator('position', {initialValue: userInfo.position})(<Input/>)
          }
          </Form.Item>
          <Form.Item label="个人简介">
            {
              getFieldDecorator('introduce', {initialValue: userInfo.introduce})(<Input.TextArea rows={2}/>)
            }
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  render() {
    let { userInfo } = this.state
    return (
      <div className="personal">
        <p className="title">个人资料</p>
        <div className="userInfo">
          <div className="avatar">
            <UploadImage 
              imagePath={userInfo.avatar} 
              folder="avatar" 
              uploadSuccess={this.uploadSuccess.bind()}
            />
          </div>
          <div className="right-info">
            <div className="top">
              <span className="ID">ID: {userInfo.id}</span>
              <span className="edit" onClick={() => {this.setState({visible: true})}}>修改资料</span>
            </div>
            <div className="number">
              <span>关注：<span className="field">{userInfo.follow_number}</span></span>
              <span>粉丝：<span className="field">{userInfo.fans_number}</span></span>
            </div>
            <div className="nickname">昵称：{userInfo.nickname}</div>
            <div>座右铭：<span className="field">{userInfo.motto || '-'}</span></div>
            <div>性别：<span className="field">{userInfo.gender === 0 ? '男' : (userInfo === 1 ? '女' : '未知')}</span></div>
            <div>生日：<span className="field">{userInfo.birthday || '-'}</span></div>
            <div>地区：<span className="field">{userInfo.province ? (userInfo.province + " " + userInfo.city + " " + userInfo.area) : '-'}</span></div>
            <div>行业：<span className="field">{userInfo.industry || '-'}</span></div>
            <div>职位：<span className="field">{userInfo.position || '-'}</span></div>
            <div>简介：<span className="field">{userInfo.introduce || '-'}</span></div>
          </div>
        </div>
        {this.renderUserModal()}
      </div>
    );
  }
}

export default connect()(Form.create({ name: 'userInfo' })(User));